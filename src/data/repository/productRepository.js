const db = require('../models/init');

const ProductModel = db.products;

const createProduct = async (product) => ProductModel.create(product);

const findProducts = async () => ProductModel.findAll();

const findProductById = async (productId) => ProductModel.findByPk(productId);

const findProductsByName = async (productName) => ProductModel.findAll({ where: { productName } });

const findProductsBySellerId = async (sellerId) => ProductModel.findAll({ where: { sellerId } });

const updateProduct = async (productId, update) => ProductModel.update(update, { where: { id: productId } });

const deleteProduct = async (productId) => ProductModel.destroy({ where: { id: productId } });

module.exports = {
  createProduct,
  findProducts,
  findProductById,
  findProductsByName,
  findProductsBySellerId,
  updateProduct,
  deleteProduct,
};
