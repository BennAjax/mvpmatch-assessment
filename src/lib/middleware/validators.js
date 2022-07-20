const Joi = require('joi');
const { validate } = require('./joiValidation');
const { BUYER, SELLER } = require('../constants');

const login = validate({
  body: {
    username: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
  },
});

const deposit = validate({
  body: {
    coin: Joi.number().valid(5, 10, 20, 50, 100).required(),
  },
});

const buy = validate({
  body: {
    productId: Joi.number().required(),
    amount: Joi.number().required(),
  },
});

const getUsersById = validate({
  params: {
    id: Joi.number(),
  },
});

const createUser = validate({
  body: {
    username: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
    role: Joi.string().valid(BUYER, SELLER).required(),
  },
});

const updateUser = validate({
  params: {
    id: Joi.number().required(),
  },
  body: {
    username: Joi.string().trim(),
    password: Joi.string().trim(),
    role: Joi.string().valid(BUYER, SELLER),
  },
});

const deleteUser = validate({
  params: {
    id: Joi.number().required(),
  },
});

const getProductById = validate({
  params: {
    id: Joi.number(),
  },
});

const createProduct = validate({
  body: {
    amountAvailable: Joi.number().required(),
    cost: Joi.number().required(),
    productName: Joi.string().trim().required(),
    sellerId: Joi.number().required(),
  },
});

const updateProduct = validate({
  params: {
    id: Joi.number().required(),
  },
  body: {
    amountAvailable: Joi.number(),
    cost: Joi.number(),
    productName: Joi.string().trim(),
  },
});

const deleteProduct = validate({
  params: {
    id: Joi.number().required(),
  },
});

module.exports = {
  login,
  deposit,
  buy,
  getUsersById,
  createUser,
  updateUser,
  deleteUser,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
