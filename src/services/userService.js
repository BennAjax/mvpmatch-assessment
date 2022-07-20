const bcrypt = require('bcryptjs');
const { createToken } = require('../lib/jwt');
const userRepository = require('../data/repository/userRepository');
const BadRequestError = require('../lib/errors/BadRequestError');
const InternalError = require('../lib/errors/InternalError');
const NotFoundError = require('../lib/errors/NotFoundError');
const UnauthorizedError = require('../lib/errors/UnauthorizedError');
const {
  USERNAME_EXIST,
  INVALID_ARGUMENT,
  USER_CREATION_ERROR,
  USER_NOT_FOUND,
  NO_UPDATE_ARGUMENT,
  USER_UPDATE_ERROR,
  USER_DELETE_ERROR,
  INVALID_CREDENTIALS,
  BUYER,
  UNAUTHORIZED_DEPOSIT,
  DEPOSIT_ERROR,
  DEPOSIT_RESET_ERROR,
} = require('../lib/constants');

const SALT_WORK_FACTOR = 10;

const generateHash = async (password) => {
  if (!password) throw new Error(INVALID_ARGUMENT);

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    return bcrypt.hash(password, salt);
  } catch (e) {
    throw new Error(e.message);
  }
};

const login = async (username, password) => {
  const user = await userRepository.findUserByUsername(username);
  if (!user) throw new BadRequestError(INVALID_CREDENTIALS);

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new BadRequestError(INVALID_CREDENTIALS);

  return createToken(user.id, user.role, user.username);
};

const depositCoin = async (user, coin) => {
  if (!coin) throw new Error(INVALID_ARGUMENT);

  if (user.role !== BUYER) throw new UnauthorizedError(UNAUTHORIZED_DEPOSIT);

  try {
    const dbUser = await userRepository.findUserById(user.id);
    await dbUser.increment('deposit', { by: coin });
  } catch (e) {
    throw new InternalError(DEPOSIT_ERROR);
  }
};

const resetDeposit = async (user) => {
  if (user.role !== BUYER) throw new UnauthorizedError(UNAUTHORIZED_DEPOSIT);

  const update = { deposit: 0 };

  try {
    await userRepository.updateUser(user.id, update);
  } catch (e) {
    throw new InternalError(DEPOSIT_RESET_ERROR);
  }
};

const createUser = async (username, password, role) => {
  if (!username || !password || !role) throw new Error(INVALID_ARGUMENT);

  const existingUser = await userRepository.findUserByUsername(username);
  if (existingUser) throw new BadRequestError(USERNAME_EXIST);

  const user = {
    username,
    password: await generateHash(password),
    deposit: 0,
    role,
  };

  try {
    await userRepository.createUser(user);
  } catch (e) {
    throw new InternalError(USER_CREATION_ERROR);
  }
};

const getUsers = async () =>
  userRepository.findUsers().then((result) =>
    result.map((user) => ({
      id: user.id,
      username: user.username,
      deposit: user.deposit,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))
  );

const getUserById = async (userId) => {
  if (!userId) throw new Error(INVALID_ARGUMENT);

  const user = await userRepository.findUserById(userId);
  if (!user) throw new NotFoundError(USER_NOT_FOUND);
  delete user.dataValues.password;
  return user;
};

const updateUser = async (userId, username, password, role) => {
  if (!userId) throw new Error(INVALID_ARGUMENT);

  const update = {
    username,
    password: password && (await generateHash(password)),
    role,
  };

  Object.keys(update).forEach((key) => (update[key] === undefined || update[key] === null) && delete update[key]);

  if (Object.keys(update).length === 0) throw new BadRequestError(NO_UPDATE_ARGUMENT);

  try {
    await userRepository.updateUser(userId, update);
  } catch (e) {
    throw new InternalError(USER_UPDATE_ERROR);
  }
};

const deleteUser = async (userId) => {
  if (!userId) throw new Error(INVALID_ARGUMENT);

  try {
    await userRepository.deleteUser(userId);
  } catch (e) {
    throw new InternalError(USER_DELETE_ERROR);
  }
};

module.exports = {
  generateHash,
  login,
  depositCoin,
  resetDeposit,
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
