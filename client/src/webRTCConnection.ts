import { io } from 'socket.io-client';

export const socket = io('http://localhost:8080', {
  path: '/socket.io',
  transports: ['websocket'],
});
