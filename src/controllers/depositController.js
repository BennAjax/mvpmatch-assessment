const userService = require('../services/userService');

const depositCoin = (req, res, next) =>
  userService
    .depositCoin(req.user, req.body.coin)
    .then(() => res.status(201).json({ status: 'Successful' }))
    .catch((err) => next(err));

const resetDeposit = (req, res, next) =>
  userService
    .resetDeposit(req.user)
    .then(() => res.status(200).json({ status: 'Successful' }))
    .catch((err) => next(err));

module.exports = { depositCoin, resetDeposit };
