const userService = require('../services/userService');

const createUser = (req, res, next) =>
  userService
    .createUser(req.body.username, req.body.password, req.body.role)
    .then(() => res.status(201).json({ status: 'Successful' }))
    .catch((err) => next(err));

const getUsers = async (req, res, next) => {
  if (req.params.id) {
    return userService
      .getUserById(req.params.id)
      .then((results) => res.status(200).json(results))
      .catch((err) => next(err));
  }

  return userService
    .getUsers()
    .then((results) => res.status(200).json(results))
    .catch((err) => next(err));
};

const updateUser = (req, res, next) =>
  userService
    .updateUser(req.params.id, req.body.username, req.body.password, req.body.role)
    .then(() => res.status(200).json({ status: 'Successful' }))
    .catch((err) => next(err));

const deleteUser = (req, res, next) =>
  userService
    .deleteUser(req.params.id)
    .then(() => res.status(200).json({ status: 'Successful' }))
    .catch((err) => next(err));

module.exports = { createUser, getUsers, updateUser, deleteUser };
