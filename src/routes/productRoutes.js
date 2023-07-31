const express = require('express');
const router = express.Router();
const Product =require('../models/ProductsShema')
const ProdutosVendidos=require('../models/ProdutosVendidos')
const asyncHandler = require('express-async-handler')
const User=require('../models/UserSchema')
const { getIO } = require('../socke');

router.post('/:id/add', asyncHandler(async (req, res) => {
    try {
      const {title,type,description,price,size,condition,categories,brand,images} = req.body;
      const seller=req.params.id  
    const product = new Product({
        title,
        description,
        categories,
        brand,
        type,
        size,
        condition,
        price,
        images,
        seller,
        });
        console.log(product)
        // Salvar o produto
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
        const io = getIO();
        io.emit('newProduct', { product: req.body });
    } catch (error) {
        console.log("errouuuu")
        res.status(400).json({ message: error.message });
    }
  
  }))


  // Atualizar um produto com um determinado id
router.put('/:id', asyncHandler(async (req, res) => {
    try {
      const {title,type,description,price,size,condition,categories,brand,images} = req.body;
      const {id} = req.params;
      const product = await Product.findById(id);
      if (product) {
        product.title = title || product.title;
        product.type = type || product.type;
        product.description = description || product.description;
        product.price = price || product.price;
        product.size = size || product.size;
        product.condition = condition || product.condition;
        product.categories = categories || product.categories;
        product.brand = brand || product.brand;
        product.images = images || product.images;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Produto não encontrado' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }));
  
  // Excluir um produto com um determinado id
  
  router.delete('/:id', asyncHandler(async (req, res) => {
    try {
      const {id} = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (deletedProduct) {
        res.json({ message: 'Produto excluído com sucesso' });
      } else {
        res.status(404).json({ message: 'Produto não encontrado' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }));

//obter todos os  produtos criados pelo user
  router.get('/user/:id', asyncHandler(async (req, res) => {
    try {
      const {id} = req.params;
      const products = await Product.find({ seller: id });
      res.json(products);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }));
  
  //obter  todos os produtos na base de dados
  router.get('/', asyncHandler(async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }));
  
  //retornar os   da preferencia de um utilizador
  router.get('/user/:id/preferred-products', asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const {categorias, marca, tamanho} = user.preferencias;
  
      // buscar os produtos preferidos do usuário
      const preferredProducts = await Product.find({ 
        $or:[
          {categories:{ $in: categorias }},
          {brand:{ $in: marca }},
          {tamanho:{$in: tamanho }}
        ]
      });
  
      // buscar todos os produtos que não foram incluídos na filtragem
      const allProducts = await Product.find({
        _id: { $nin: preferredProducts.map(p => p._id) }
      });
  
      // adicionar os produtos restantes aos produtos preferidos
      preferredProducts.push(...allProducts);
  
      res.json(preferredProducts);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }));
  

  //obter um produto pelo Id
  router.get('/:id', asyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
  
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }));


  //obter  todos os produtos comprados por um user
  router.get('/produtos-comprados/:userId', async (req, res) => {
    try {
      const produtos = await ProdutosVendidos.find({ buyer: req.params.userId }).populate('categories brand buyer');
      res.json(produtos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

//obter todos os produtos  vendidos por um dados user
  router.get('/produtos-vendidos/:userId', async (req, res) => {
    try {
      const produtos = await ProdutosVendidos.find({ seller: req.params.userId }).populate('categories brand seller');
      res.json(produtos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  




  
  
  
module.exports = router;
