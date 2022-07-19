const productService = require('../services/productService');

const createProduct = (req, res, next) =>{ console.log(req.body)
  productService
    .createProduct(req.user, req.body.amountAvailable, req.body.cost, req.body.productName, req.body.sellerId)
    .then(() => res.status(201).json({ status: 'Successful' }))
    .catch((err) => next(err));
}
const getProducts = async (req, res, next) => {
  if (req.params.id) {
    return productService
      .getProductById(req.params.id)
      .then((results) => res.status(200).json(results))
      .catch((err) => next(err));
  }

  if (req.query.sellerId) {
    return productService
      .getProductsBySellerId(req.query.sellerId)
      .then((results) => res.status(200).json(results))
      .catch((err) => next(err));
  }

  return productService
    .getProducts()
    .then((results) => res.status(200).json(results))
    .catch((err) => next(err));
};

const updateProduct = (req, res, next) =>
  productService
    .updateProduct(req.user, req.params.id, req.body.amountAvailable, req.body.cost, req.body.productName)
    .then(() => res.status(200).json({ status: 'Successful' }))
    .catch((err) => next(err));

const deleteProduct = (req, res, next) =>
  productService
    .deleteProduct(req.user, req.params.id)
    .then(() => res.status(200).json({ status: 'Successful' }))
    .catch((err) => next(err));

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };
