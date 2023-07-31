const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// schema para marca de cada produto
const marcaSchema = new Schema({
name: {
    type: String,
    required: true,
    unique:true
},

});


const Marca = mongoose.model('Marca', marcaSchema);


module.exports = Marca;