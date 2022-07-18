const httpStatus = require('http-status');
const NotFoundError = require('./NotFoundError');

describe('NotFoundError', () => {
  test('should return error', () => {
    const testError = new NotFoundError('Test Error');
    expect(testError.message).toBe('Test Error');
    expect(testError.status).toBe(httpStatus.NOT_FOUND);
  });
});
