const Product = require('../models/ProductsShema');
const asyncHandler = require('express-async-handler')
const cloudinary = require('../config/cloudinary')
const upload = require('../middleware/multer')


const productsController = {};

productsController.createProduct = asyncHandler(async (req, res) => {
    try {
    const { title,type,description,price,size,condition,categories,brand,images} = req.body;
    const seller=req.params.id
    console.log(images  )
    // Fazer upload de cada imagem no Cloudinary e guardar as URLs
    const imageUrls='';
    const result = await cloudinary.uploader.upload(images.path);
    console.log(result)
    imageUrls=result.secure_url;

    console.log(imageUrls)
    

    // Criar o objeto de produto
    const product = new Product({
      title,
      description,
      categories,
      brand,
      type,
      size,
      condition,
      price,
      imageUrls,
      seller,
      });
      console.log(product)
      // Salvar o produto
      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

});



module.exports = productsController;
