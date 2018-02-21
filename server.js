const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const authentication = require('./authentication');
const serverHelpers = require('./serverHelpers');
const { Pool } = require('pg');

const app = express();
app.use(express.static(path.join(__dirname, 'build')));

const server = app.listen(8080);
const io = socketIo.listen(server);
const SpotifyWebApi = require('spotify-web-api-node');

const pool = new Pool(authentication.poolData);

const API_REFRESH_TIME = 1000 * 60 * 59;
const DATABASE_REFRESHTIME = 1000 * 60 * 10;

// Sends a new generic API for the client every hour. Does not allow for
// access of user data, only playlist fetching.
const clientSpotifyApi = new SpotifyWebApi(authentication.spotifyCredentials);
(async () => {
  await authentication.spotifyRefreshToken(clientSpotifyApi);
  console.log(`clientSpotifyApi loaded  ${JSON.stringify(clientSpotifyApi._credentials.accessToken)}`);
})();
setInterval(() => {
  (async () => {
    await authentication.spotifyRefreshToken(clientSpotifyApi);
    console.log(`clientSpotifyApi refreshed  ${JSON.stringify(clientSpotifyApi._credentials.accessToken)}`);
    io.emit('action', { type: 'sendClientSpotifyApi', clientSpotifyApi });
  })();
}, API_REFRESH_TIME);

// Parses Data from the database to send to the user as statistics.
// Resends the data every 10 minutes.
let databaseStats;
(async () => {
  databaseStats = await serverHelpers.getDatabaseStats(pool);
})();
setInterval(() => {
  (async () => {
    databaseStats = await serverHelpers.getDatabaseStats(pool);
    io.emit('action', { type: 'sendClientDatabaseStats', databaseStats });
  })();
}, DATABASE_REFRESHTIME);


io.on('connection', onConnect);

function onConnect(socket) {
  // Send the newly connected client the server's generic API and database stats.
  socket.emit('action', { type: 'sendClientSpotifyApi', clientSpotifyApi });
  socket.emit('action', { type: 'sendClientDatabaseStats', databaseStats });
  console.log(`Sent initial data to client  ${socket.id}`);

  socket.on('action', (action) => {
    if (action.type === 'server/userLogin') {
      (async () => {
        socket.emit('action', { type: 'LOGIN_REQUEST' });
        const userSpotifyApi = new SpotifyWebApi(authentication.spotifyCredentials);
        try {
          const data = await userSpotifyApi.authorizationCodeGrant(action.userCode);
          userSpotifyApi.setAccessToken(data.body.access_token);
          userSpotifyApi.setRefreshToken(data.body.refresh_token);
          socket.emit('action', { type: 'LOGIN_SUCCESS', userSpotifyApi });
        } catch (err) {
          socket.emit('action', { type: 'LOGIN_FAILURE' });
        }
      })();
    }
    if (action.type === 'server/getPlaylist') {
      (async () => {
        try {
          const values = serverHelpers.parseUserPlaylist(action.playlistData);

          const querypart1 = 'INSERT INTO playlists VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (id, owner) ';
          const querypart2 = 'DO UPDATE SET name=$3, description=$4, followers=$5, public=$6, collaborative=$7, ';
          const querypart3 = 'snapshot_id=$8, "songStats"=$9, "audioFeatures"=$10;';

          await pool.query(querypart1 + querypart2 + querypart3, values);
        } catch (err) {
          console.log(err);
        }
      })();
    }
    if (action.type === 'server/getUserData') {
      (async () => {
        try {
          const values = serverHelpers.parseUserUser(action)

          const querypart1 = 'INSERT INTO users VALUES($1,$2,$3,$4) ON CONFLICT (id) ';
          const querypart2 = 'DO UPDATE SET id=$1, followers=$2, product=$3, playlists=$4;';

          await pool.query(querypart1 + querypart2, values);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  });
}
