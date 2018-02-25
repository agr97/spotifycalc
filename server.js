require('dotenv').config();
const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const serverHelpers = require('./serverHelpers');
const { Pool } = require('pg');
const SpotifyWebApi = require('spotify-web-api-node');
const bunyan = require('bunyan');
const SQL = require('sql-template-strings');

const log = bunyan.createLogger({ name: 'pcalcserver' });

const app = express();
app.use(express.static(path.join(__dirname, 'build')));

const server = app.listen(process.env.listenPort);
const io = socketIo.listen(server);

const pool = new Pool(serverHelpers.poolData);

const API_REFRESH_TIME = 1000 * 60 * 59;
const DATABASE_REFRESHTIME = 1000 * 60 * 10;

// Sends a new generic API for the client every hour. Does not allow for
// access of user data, only playlist fetching.
const clientSpotifyApi = new SpotifyWebApi(serverHelpers.spotifyCredentials);
(async () => {
  await serverHelpers.spotifyRefreshToken(clientSpotifyApi, log);
  log.info(`clientSpotifyApi loaded  ${JSON.stringify(clientSpotifyApi._credentials.accessToken.substring(0, 15))}`);
})();
setInterval(async () => {
  await serverHelpers.spotifyRefreshToken(clientSpotifyApi, log);
  log.info(`clientSpotifyApi refreshed  ${JSON.stringify(clientSpotifyApi._credentials.accessToken.substring(0, 15))}`);
  io.emit('action', { type: 'SENDCLIENTSPOTIFYAPI', clientSpotifyApi });
}, API_REFRESH_TIME);


// Parses Data from the database to send to the user as statistics.
// Resends the data every 10 minutes.
let databaseStats;
(async () => {
  try {
    const playlists = await pool.query(SQL`SELECT * from playlists`);
    const userData = await pool.query(SQL`SELECT * from users`);
    databaseStats = serverHelpers.parseDatabaseStats(playlists, userData);
  } catch (err) {
    log.warn('Failed to Connect to Postgres');
    process.exit();
  }
})();
setInterval(async () => {
  try {
    const playlists = await pool.query(SQL`SELECT * from playlists`);
    const userData = await pool.query(SQL`SELECT * from users`);
    databaseStats = serverHelpers.parseDatabaseStats(playlists, userData);
  } catch (err) {
    log.warn(err);
  }
  io.emit('action', { type: 'SENDCLIENTDATABASESTATS', databaseStats });
}, DATABASE_REFRESHTIME);


io.on('connection', onConnect);

function onConnect(socket) {
  // Send the newly connected client the server's generic API and database stats.
  socket.emit('action', { type: 'SENDCLIENTSPOTIFYAPI', clientSpotifyApi });
  socket.emit('action', { type: 'SENDCLIENTDATABASESTATS', databaseStats });
  log.info(`Sent initial data to client  ${socket.id}`);

  socket.on('action', async (action) => {
    if (action.type === 'SERVER/USERLOGIN') {
      socket.emit('action', { type: 'LOGIN_REQUEST' });
      const userSpotifyApi = new SpotifyWebApi(serverHelpers.spotifyCredentials);
      let userData;
      let userPlaylists;
      let uploadToDatabase = false;

      // Send User Data to User
      try {
        const authCode = await userSpotifyApi.authorizationCodeGrant(action.userCode);
        userSpotifyApi.setAccessToken(authCode.body.access_token);

        userData = await userSpotifyApi.getMe();
        userPlaylists = await userSpotifyApi.getUserPlaylists(userData.body.id, { limit: 50 });

        uploadToDatabase = true;
        
        socket.emit('action', {
          type: 'LOGIN_SUCCESS',
          userSpotifyApi,
          userData: userData.body,
          userPlaylists: userPlaylists.body,
        });
      } catch (err) {
        socket.emit('action', { type: 'LOGIN_FAILURE' });
      }
      
      if (uploadToDatabase) {
        try {
          const values = [
            userData.body.id,
            userData.body.total,
            userData.body.product,
            userPlaylists.body.items.total,
          ]
  
          await pool.query(SQL`
            INSERT
            INTO    users
                    (id, followers, product, playlist)
            VALUES  (${values[0]}, ${values[1]}, ${values[2]}, ${values[3]})
            ON CONFLICT (id)
            DO UPDATE SET id=${values[0]}, followers=${values[1]}, product=${values[2]}, playlist=${values[3]};
          `);
        } catch (err) {
          log.warn(err);
        }
      }
    }
    if (action.type === 'SERVER/GETPLAYLIST') {
      try {
        const values = serverHelpers.parseUserPlaylist(action.playlistData);

        await pool.query(SQL`
          INSERT
          INTO    playlists
                  (id, owner, name, description, followers, public, collaborative, snapshot_id, songstats, audiofeatures)
          VALUES  (${values[0]}, ${values[1]}, ${values[2]}, ${values[3]}, ${values[4]}, ${values[5]}, ${values[6]}, ${values[7]}, ${values[8]}, ${values[9]})
          ON CONFLICT (id, owner)
          DO UPDATE SET name=${values[2]}, description=${values[3]}, followers=${values[4]}, public=${values[5]}, collaborative=${values[6]}, snapshot_id=${values[7]}, songstats=${values[8]}, audiofeatures=${values[9]};
        `);
      } catch (err) {
        log.warn(err);
      }
    }
  });
}
