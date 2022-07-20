const userRepository = require('../data/repository/userRepository');
const productRepository = require('../data/repository/productRepository');
const userService = require('../services/userService');

const createUserCrendential = async (role, username = 'test-user', deposit = 0) => {
  const credentials = { username, password: 'test-password' };
  const user = {
    username: credentials.username,
    password: await userService.generateHash(credentials.password),
    deposit,
    role,
  };
  await userRepository.createUser(user);
  const token = await userService.login(credentials.username, credentials.password);
  credentials.token = token;
  return credentials;
};

const createProduct = async (productName, sellerId) => {
  const product = {
    amountAvailable: 7,
    cost: 50,
    productName,
    sellerId,
  };

  await productRepository.createProduct(product);
};
module.exports = { createUserCrendential, createProduct };
