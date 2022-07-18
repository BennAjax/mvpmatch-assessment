const httpStatus = require('http-status');
const APIError = require('./APIError');

class InternalError extends APIError {
  constructor(message) {
    super(message, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

module.exports = InternalError;
