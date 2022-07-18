const httpStatus = require('http-status');
const APIError = require('./APIError');

class BadRequestError extends APIError {
  constructor(message) {
    super(message, httpStatus.BAD_REQUEST);
  }
}

module.exports = BadRequestError;
