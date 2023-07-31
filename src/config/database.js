const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conexão bem-sucedida à base de dados MongoDB.");
}).catch(err => {
    console.log('Não foi possível conectar à base de dados MongoDB.', err);
    process.exit();
});

module.exports = mongoose.connection;
