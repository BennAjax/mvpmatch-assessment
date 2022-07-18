const httpStatus = require('http-status');
const InternalError = require('./InternalError');

describe('InternalError', () => {
  test('should return error', () => {
    const testError = new InternalError('Test Error');
    expect(testError.message).toBe('Test Error');
    expect(testError.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
  });
});
