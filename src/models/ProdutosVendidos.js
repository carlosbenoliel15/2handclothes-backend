const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const produtosVendidoSchema = new Schema({
  previousId:{ type: String, required: true, unique:true},
  title: { type: String, required: true },
  description: { type: String, required: true },
  categories: {type: Schema.Types.ObjectId, ref: 'Categoria', required: true},
  brand: {type: Schema.Types.ObjectId, ref: 'Marca', required: true},
  type: { type: String, required: true },
  size: { type: String, required: true },
  condition: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type:[String], required: true },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  soldPrice: { type: Number, required: true },
  soldDate: { type: Date, default: Date.now, required: true }
});

const ProdutoVendido = mongoose.model('ProdutoVendido', produtosVendidoSchema);

module.exports = ProdutoVendido;
