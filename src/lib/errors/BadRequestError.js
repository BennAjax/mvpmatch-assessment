const httpStatus = require('http-status');
const APIError = require('./APIError');

class BadRequestError extends APIError {
  constructor(message, meta) {
    super(message, httpStatus.BAD_REQUEST, meta);
  }
}

module.exports = BadRequestError;
