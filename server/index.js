const SocketIO = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();

const httpServer = http.createServer(app);

const wsServer = SocketIO(httpServer);

app.get('/', (_, res) => res.send('<h1>Run server</h1>'));

wsServer.on('connection', (socket) => {});

httpServer.listen(8080, () => {
  console.log('server open');
});
