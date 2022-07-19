const express = require('express');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const { verifyToken } = require('../lib/jwt');

const router = express.Router();

const health = (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.send({ status: 'OK' });
};

router.get('/health', health);

router.post('/login', userController.login);

router.get('/users/:id?', verifyToken, userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', verifyToken, userController.updateUser);
router.delete('/users/:id', verifyToken, userController.deleteUser);

router.get('/products/:id?', verifyToken, productController.getProducts);
router.post('/products', verifyToken, productController.createProduct);
router.put('/products/:id', verifyToken, productController.updateProduct);
router.delete('/products/:id', verifyToken, productController.deleteProduct);

module.exports = router;
