const socketIO = require('socket.io');
const ChatRooms = require('./models/ChatRoom');
const asyncHandler = require('express-async-handler');
const User = require('../src/models/UserSchema');

let io;

const configureWebSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: 'http://localhost:4200',
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    socket.on('join', async (data) => {
      socket.join(data.room);
      try {
        const rooms = await ChatRooms.find({ name: data.room });
        let count = 0;
        rooms.forEach((room) => {
          if (room.name === data.room) {
            count++;
          }
        });
        if (count === 0) {
          const chatRoom = new ChatRooms({ name: data.room, messages: [] });
          const newChat = await chatRoom.save();
          console.log('Chat room created');
          console.log(newChat);
        }
      } catch (err) {
        console.log(err);
        return false;
      }
    });

    socket.on('message', async (data) => {
      io.in(data.room).emit('new message', { user: data.user, message: data.message });
      try {
        const updatedChatRoom = await ChatRooms.findOneAndUpdate(
          { name: data.room },
          { $push: { messages: { user: data.user, message: data.message } } },
          { new: true }
        );
        console.log('Chat room updated');
      } catch (err) {
        console.log(err);
        return false;
      }
    });

    socket.on('typing', (data) => {
      socket.broadcast.in(data.room).emit('typing', { data: data, isTyping: true });
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { configureWebSocket, getIO };
