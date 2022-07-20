const productService = require('../services/productService');

const buyProduct = (req, res, next) =>
  productService
    .buyProduct(req.user, req.body.productId, req.body.amount)
    .then((results) => res.status(200).json(results))
    .catch((err) => next(err));

module.exports = { buyProduct };
