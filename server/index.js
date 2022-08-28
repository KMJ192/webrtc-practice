const SocketIO = require('socket.io');
const express = require('express');

const app = express();

const server = app.listen(8080, () => {});
const io = SocketIO(server, { path: '/socket.io' });

io.on('connection', (socket) => {
  socket.on('ice', (ice, roomName) => {
    socket.to(roomName).emit('ice', ice);
  });

  socket.on('offer', (offer, roomName) => {
    socket.to(roomName).emit('offer', offer);
  });
});
