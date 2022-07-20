const db = require('../models/init');

const ProductModel = db.products;
const UserModel = db.users;

const createProduct = async (product) => ProductModel.create(product);

const findProducts = async () => ProductModel.findAll();

const findProductById = async (productId) => ProductModel.findByPk(productId);

const findProductByName = async (productName) => ProductModel.findOne({ where: { productName } });

const findProductsBySellerId = async (sellerId) => ProductModel.findAll({ where: { sellerId } });

const updateProduct = async (productId, update) => ProductModel.update(update, { where: { id: productId } });

const deleteProduct = async (productId) => ProductModel.destroy({ where: { id: productId } });

const buyProduct = async (userId, productId, amount, totalCost) => {
  const t = await db.sequelize.transaction();

  try {
    const user = await UserModel.findOne({ where: { id: userId } }, { transaction: t });
    await user.decrement('deposit', { by: totalCost });

    const product = await ProductModel.findOne({ where: { id: productId } }, { transaction: t });
    await product.decrement('amountAvailable', { by: amount });

    await t.commit();
  } catch (e) {
    console.log(e);
    await t.rollback();
    throw new Error();
  }
};

module.exports = {
  createProduct,
  findProducts,
  findProductById,
  findProductByName,
  findProductsBySellerId,
  updateProduct,
  deleteProduct,
  buyProduct,
};
