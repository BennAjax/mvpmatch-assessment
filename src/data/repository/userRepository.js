const db = require('../models/init');

const UserModel = db.users;

const createUser = async (user) => UserModel.create(user);

const findUsers = async () => UserModel.findAll();

const findUserById = async (userId) => UserModel.findByPk(userId);

const findUserByUsername = async (username) => UserModel.findOne({ where: { username } });

const updateUser = async (userId, update) => UserModel.update(update, { where: { id: userId } });

const deleteUser = async (userId) => UserModel.destroy({ where: { id: userId } });

module.exports = { createUser, findUsers, findUserById, findUserByUsername, updateUser, deleteUser };
