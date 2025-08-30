import { Server } from 'socket.io';

let _io;

export const initSocket = (httpServer) => {
  _io = new Server(httpServer, {
    cors: { origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }
  });

  _io.on('connection', (socket) => {
    // Client should emit 'join:board' with boardId to receive board events
    socket.on('join:board', (boardId) => {
      if (!boardId) return;
      socket.join(boardId.toString());
    });

    socket.on('leave:board', (boardId) => {
      if (!boardId) return;
      socket.leave(boardId.toString());
    });

  });

  console.log('Socket.IO initialized');
};

export const io = () => _io;
