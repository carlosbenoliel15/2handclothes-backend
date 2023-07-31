const express = require('express');
const router = express.Router();
const userController = require('../controllers/userContoller');

// Rota para obter um usuário pelo ID
router.get('/:id', userController.getUserById);

// Rota para atualizar um usuário pelo ID
router.put('/:id', userController.updateUser);

// Rota para excluir um usuário pelo ID
router.delete('/:id', userController.deleteUser);

router.get('/', userController.getAllUsers);

router.get('/users/search', userController.searchUsers);

router.post('/:userId/favorites/:productId', userController.addFavoriteProduct);

router.post('/:userId/cart/:productId', userController.addProductToCart);

router.delete('/:userId/favorites/:productId', userController.removeFavoriteProduct);

router.get('/:userId/favorites', userController.getFavoriteProducts);

router.delete('/:userId/cart/:productId', userController.removeProductFromCart);

router.get('/:userId/cart', userController.getAllProductsFromCart);

router.post('/:userId/buy', userController.buyProduct)



module.exports = router;
