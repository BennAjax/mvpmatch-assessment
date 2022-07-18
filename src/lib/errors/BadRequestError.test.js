const httpStatus = require('http-status');
const BadRequestError = require('./BadRequestError');

describe('BadRequestError', () => {
  test('should return error', () => {
    const testError = new BadRequestError('Test Error');
    expect(testError.message).toBe('Test Error');
    expect(testError.status).toBe(httpStatus.BAD_REQUEST);
  });
});
