const express = require('express');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');

const router = express.Router();

const health = (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.send({ status: 'OK' });
};

router.get('/health', health);

router.get('/users/:id?', userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

router.get('/products/:id?', productController.getProducts);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
