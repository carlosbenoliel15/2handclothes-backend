const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database');
const registerController = require('./controllers/registerUserController');
const loginController = require('./controllers/loginController');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoriasRoutes');
const marcaRoutes = require('./routes/marcaRoutes');
const ChatRooms = require('./models/ChatRoom');
const asyncHandler = require('express-async-handler');
const User = require('../src/models/UserSchema');
const { configureWebSocket } = require('./socke');

require('dotenv').config();

const app = express();

db.on('error', console.error.bind(console, 'Erro de conexão com MongoDB:'));
db.once('open', () => {
  console.log('Conexão bem-sucedida com MongoDB');

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const PORT = process.env.PORT || 8080;

  const server = app.listen(PORT, () => {
    console.log(`Servidor em execução na porta ${PORT}.`);
  });

  const io = configureWebSocket(server);

  io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);
    // Lógica adicional do socket.io, se necessário
  });

  // Routes base:
  app.use('/users', userRoutes);
  app.use('/categorias', categoryRoutes);
  app.use('/marcas', marcaRoutes);

  app.use('/products', productRoutes);

  // Routes finais
  app.post('/register', registerController.registerUser);
  app.post('/login', loginController.loginUser);

  app.get('/chatroom/:room', asyncHandler(async (req, res) => {
    try {
      const { room } = req.params;
      console.log("room")
      console.log(room)

      const chatRoom = await ChatRooms.findOne({ name: room });
      console.log(chatRoom)
      if (chatRoom) {
        console.log(chatRoom.messages);
        res.json(chatRoom.messages);
      } else {
        res.status(400).json("No chat found");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }));
  


  app.get('/chatrooms/user/:userId', asyncHandler(async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      
      if (!user) {
        res.status(400).json("User not found");
        return;
      }
      
      const chatRooms = await ChatRooms.find();
      console.log(chatRooms);
  
      const userRooms = chatRooms.filter(room => room.name.includes(user.email));
      console.log(userRooms)
      const resultUsers = [];
      if(userRooms){
        for (const room of userRooms) {
            const emails = room.name.split(',');
            for (const email of emails) {
              const trimmedEmail = email.trim();
              if (trimmedEmail !== user.email) {
                const otherUser = await User.findOne({ email: trimmedEmail });
                if (otherUser) {
                  resultUsers.push(otherUser);
                }
              }
            }
          }
      
          if (resultUsers.length > 0) {
            res.json(resultUsers);
          } else {
            res.status(400).json("No users found in the chat rooms");
          }
      }else {
        res.status(400).json("No userrooms found");
      }

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }));
  
  

});
