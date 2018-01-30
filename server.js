const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const authentication = require('./authentication');

const app = express();
const server = app.listen(8080);// http.createServer(app);
const io = socketIo.listen(server);
const SpotifyWebApi = require('spotify-web-api-node');

app.use(express.static(path.join(__dirname, 'build')));


// Generates a new generic API for the client every hour. Does not allow for
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
  })();
}, 3590000);

// spotifyApi.getPlaylist('121410021', '4FO2WXjS922s0RheaTYPZK')
// spotifyApi.getPlaylist('nonnoobgod', '2eIlWTq7gSFGZJXnu0I5DP')


io.on('connection', onConnect);

function onConnect(socket) {
  console.log(`Socket Connected: ${socket.id}`);

  // Send the newly connected client the server's generic API, and then sends the new one
  // every hour after the server fetches a new one.
  socket.emit('action', { type: 'sendClientSpotifyApi', clientSpotifyApi });
  console.log(`Sent initial Api to client  ${socket.id}`);
  const sendNewClientApi = setInterval(() => {
    socket.emit('action', { type: 'sendClientSpotifyApi', clientSpotifyApi });
    console.log(`Sent new Api to client  ${socket.id}`);
  }, 3595000);


  socket.on('action', (action) => {
    switch (action.type) {
      case 'server/recieveCallbackCode': {
        break;
      }
      case 'server/userLogin': { (async () => {
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
      break;
      }
      /**
      if (action.type === 'server/sd') {
        console.log('Got hello data!', action.data);
        // socket.emit('action', {type:'message', data:'good day!'});
      }
       */
      default: {
        return true;
      }
    }
  });

  // Clears the interval that sends newly generated Api's to the client on disconnect
  socket.on('disconnect', () => {
    clearInterval(sendNewClientApi);
  });
}
