const productRepository = require('../data/repository/productRepository');
const BadRequestError = require('../lib/errors/BadRequestError');
const InternalError = require('../lib/errors/InternalError');
const NotFoundError = require('../lib/errors/NotFoundError');
const {
  INVALID_ARGUMENT,
  PRODUCTNAME_EXIST,
  PRODUCT_CREATION_ERROR,
  NO_UPDATE_ARGUMENT,
  PRODUCT_UPDATE_ERROR,
  PRODUCT_DELETE_ERROR,
  PRODUCT_NOT_FOUND,
} = require('../lib/constants');

const createProduct = async (amountAvailable, cost, productName, sellerId) => {
  if (!amountAvailable || !cost || !productName || !sellerId) throw new Error(INVALID_ARGUMENT);

  const existingProduct = await productRepository.findProductByName(productName);
  if (existingProduct) throw new BadRequestError(PRODUCTNAME_EXIST);

  const product = {
    amountAvailable,
    cost,
    productName,
    sellerId,
  };

  try {
    await productRepository.createProduct(product);
  } catch (e) {
    throw new InternalError(PRODUCT_CREATION_ERROR);
  }
};

const getProducts = async () => productRepository.findProducts();

const getProductById = async (productId) => {
  if (!productId) throw new Error(INVALID_ARGUMENT);

  const product = await productRepository.findProductById(productId);
  if (!product) throw new NotFoundError(PRODUCT_NOT_FOUND);

  return product;
};

const getProductsBySellerId = async (sellerId) => {
  if (!sellerId) throw new Error(INVALID_ARGUMENT);

  return productRepository.findProductsBySellerId(sellerId);
};

const updateProduct = async (productId, amountAvailable, cost, productName) => {
  if (!productId) throw new Error(INVALID_ARGUMENT);

  const update = {
    amountAvailable,
    cost,
    productName,
  };

  Object.keys(update).forEach((key) => (update[key] === undefined || update[key] === null) && delete update[key]);

  if (Object.keys(update).length === 0) throw new BadRequestError(NO_UPDATE_ARGUMENT);

  try {
    await productRepository.updateProduct(productId, update);
  } catch (e) {
    throw new InternalError(PRODUCT_UPDATE_ERROR);
  }
};

const deleteProduct = async (productId) => {
  if (!productId) throw new Error(INVALID_ARGUMENT);

  try {
    await productRepository.deleteProduct(productId);
  } catch (e) {
    throw new InternalError(PRODUCT_DELETE_ERROR);
  }
};

module.exports = { createProduct, getProducts, getProductById, getProductsBySellerId, updateProduct, deleteProduct };
