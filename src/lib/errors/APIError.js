class APIError extends Error {
  constructor(message, status, meta) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.meta = meta;
  }
}

module.exports = APIError;
