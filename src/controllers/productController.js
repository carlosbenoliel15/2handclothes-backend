const Product = require('../models/ProductsShema');
const Categoria = require('../models/ProductCategoriaSchema');
const Marca = require('../models/ProductMarcaSchema');


const productController = {};

productController.createCategory = async (req, res) => {
  const category = new Categoria({
    name: req.body.name,
  });
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

productController.createMarca = async (req, res) => {
  const category = new Marca({
    name: req.body.name,
  });
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

}

productController.getAllMarcas = async (req, res) => {
  try {
    const marcas = await Marca.find();
    res.status(200).json(marcas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


productController.getAllCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.status(200).json(categorias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = productController;