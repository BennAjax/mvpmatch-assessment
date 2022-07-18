const httpStatus = require('http-status');
const UnauthorizedError = require('./UnauthorizedError');

describe('UnauthorizedError', () => {
  test('should return error', () => {
    const testError = new UnauthorizedError('Test Error');
    expect(testError.message).toBe('Test Error');
    expect(testError.status).toBe(httpStatus.UNAUTHORIZED);
  });
});
