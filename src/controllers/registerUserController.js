const User = require('../models/UserSchema');
const bcrypt = require('bcryptjs');

const registerController = {};

registerController.registerUser = async (req, res) => {
  try {
    const { nome, dataNascimento, genero, morada, localidade, codigoPostal, telefone, email, password, preferencias } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Este e-mail já está em uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      nome,
      dataNascimento,
      genero,
      morada,
      localidade,
      codigoPostal,
      telefone,
      email,
      password: hashedPassword,
      preferencias
    });

    await user.save();

    res.status(201).json({ success: true, message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message});
  }
};

module.exports = registerController;
