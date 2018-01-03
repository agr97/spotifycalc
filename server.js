const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const authentication = require('./authentication');

const app = express();
const server = app.listen(8080);// http.createServer(app);
const io = socketIo.listen(server);

app.use(express.static(path.join(__dirname, 'build')));

const spotifyApi = authentication.SpotifyWebApi;
authentication.spotifyRefreshToken(spotifyApi);
setInterval(() => {
  authentication.spotifyRefreshToken(spotifyApi);
}, 3590000);


// spotifyApi.getPlaylist('121410021', '4FO2WXjS922s0RheaTYPZK')
// spotifyApi.getPlaylist('nonnoobgod', '2eIlWTq7gSFGZJXnu0I5DP')


io.sockets.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('recieveClientPlaylist', (data, callback) => {
    console.log(`${data.username} ${data.id}`);

    spotifyApi.getPlaylist(data.username, data.id)
      .then((playlist) => {
        const songs = playlist.body.tracks.total;
        console.log(songs);
        let totallength = 0;
        const totalrequests = parseInt(songs / 100) + 1;
        console.log(totalrequests);

        const currentStart = 0;

        function temp() {
          spotifyApi.getPlaylistTracks(data.username, data.id, { offset: currentStart, limit: 100, fields: 'items(track.duration_ms)' })
            .then((tracks) => {
              tracks.body.items.forEach((track) => {
                totallength += track.track.duration_ms;
              });
            }, (err) => {
              console.log('Something went wrong!', err);
            });
        }

        for (let i = 0; i < totalrequests; i++) {
          temp();
        }

        let sendTime = 250;
        if (songs >= 1000) {
          sendTime = 3000;
        }

        const t = setInterval(() => {
          console.log(totallength);
          callback('1', playlist.body, totallength);
          clearInterval(t);
        }, sendTime);

        // length().then(callback('1', playlist.body, totallength));
      }, (err) => {
        callback('err', null);
        console.log(err);
      });
  });
});


/**
server.listen(3001, () => {
  console.log('listening on *:3000');
});
*/
