const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.post('/', productController.createCategory);

router.get('/', productController.getAllCategorias);



module.exports = router;