const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createMarca);

router.get('/', productController.getAllMarcas);

module.exports = router;