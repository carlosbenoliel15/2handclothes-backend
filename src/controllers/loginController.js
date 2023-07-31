const User = require('../models/UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginController = {};

loginController.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário existe no banco de dados
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'E-mail ou senha incorretos.' });
    }

    // Verificar se a senha está correta
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: 'E-mail ou senha incorretos.' });
    }

    // Criar token de autenticação
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = loginController;
