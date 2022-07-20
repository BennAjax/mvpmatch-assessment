const express = require('express');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const { verifyToken } = require('../lib/jwt');
const {
  login,
  deposit,
  getUsersById,
  createUser,
  updateUser,
  deleteUser,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../lib/middleware/validators');

const router = express.Router();

const health = (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.send({ status: 'OK' });
};

router.get('/health', health);

router.post('/login', login, userController.login);
router.post('/deposit', [verifyToken, deposit], userController.depositCoin);
router.post('/reset', verifyToken, userController.resetDeposit);

router.get('/users/:id?', [verifyToken, getUsersById], userController.getUsers);
router.post('/users', createUser, userController.createUser);
router.put('/users/:id', [verifyToken, updateUser], userController.updateUser);
router.delete('/users/:id', [verifyToken, deleteUser], userController.deleteUser);

router.get('/products/:id?', [verifyToken, getProductById], productController.getProducts);
router.post('/products', [verifyToken, createProduct], productController.createProduct);
router.put('/products/:id', [verifyToken, updateProduct], productController.updateProduct);
router.delete('/products/:id', [verifyToken, deleteProduct], productController.deleteProduct);

module.exports = router;
