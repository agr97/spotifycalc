const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const authentication = require('./authentication');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'build')));

authentication.spotifyRefreshToken();
setInterval(() => {
  authentication.spotifyRefreshToken();
}, 3590000);


io.sockets.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('updateMessages', (data, callback) => {
    callback(serverMessages);
  });

  socket.on('receiveClientMessage', (message) => {
    serverMessages.push(message);
    console.log(`message recieved: ${message}`);
  });
});

/** 
spotifyApi.getPlaylist('nonnoobgod', '7sHlmgCE362bjKmijLEU48')
  .then(function(data) {
    console.log('gets this far');
    console.log('Some information about this playlist', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

*/

/**


app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/build/index.html`));
});




server.listen(3000, () => {
  console.log('listening on *:3000');
});
*/