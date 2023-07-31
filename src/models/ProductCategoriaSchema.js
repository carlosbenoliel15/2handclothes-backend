const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema para categoria de cada produto
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },

});



const Categoria = mongoose.model('Categoria', categorySchema);



module.exports = Categoria;