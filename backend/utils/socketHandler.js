// utils/socketHandler.js
export function ioHandlers(io) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join-room', (room) => socket.join(room));

    socket.on('chat-message', (data) => {
      io.to(data.room).emit('chat-message', { sender: data.sender, message: data.message });
    });

    socket.on('file-shared', (data) => {
      io.to(data.room).emit('file-shared', { originalName: data.originalName, url: data.url });
    });

    socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
  });
}
