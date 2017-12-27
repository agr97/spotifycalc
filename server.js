const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'build')));

const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`);
});

const serverMessages = [];

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

app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/build/index.html`));
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
