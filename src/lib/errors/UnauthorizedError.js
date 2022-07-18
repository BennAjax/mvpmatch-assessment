const httpStatus = require('http-status');
const APIError = require('./APIError');

class UnauthorizedError extends APIError {
  constructor(message) {
    super(message, httpStatus.UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;
