const USERNAME_EXIST = 'Username already exist';
const PRODUCTNAME_EXIST = 'ProductName already exist';

const INVALID_ARGUMENT = 'Invalid arguments provided';
const NO_UPDATE_ARGUMENT = 'No update arguments provided';
const INVALID_CREDENTIALS = 'Invalid credentials';

const USER_CREATION_ERROR = 'An error occurred while trying to create user';
const USER_UPDATE_ERROR = 'An error occurred while trying to update user';
const USER_DELETE_ERROR = 'An error occurred while trying to delete user';
const USER_NOT_FOUND = 'User not found';

const PRODUCT_CREATION_ERROR = 'An error occurred while trying to create product';
const PRODUCT_UPDATE_ERROR = 'An error occurred while trying to update product';
const PRODUCT_DELETE_ERROR = 'An error occurred while trying to delete product';
const PRODUCT_NOT_FOUND = 'Product not found';

const BUYER = 'buyer';
const SELLER = 'seller';

const UNAUTHORIZED_PRODUCT = 'You are unauthorized for this product';
const UNAUTHORIZED_DEPOSIT = 'You are unauthorized to make deposit';
const UNAUTHORIZED_BUY = 'You are unauthorized to buy, use a buyer role account';

const DEPOSIT_ERROR = 'An error occurred while trying to make deposit';
const DEPOSIT_RESET_ERROR = 'An error occurred while trying to reset deposit';
const BUY_ERROR = 'An error occurred while trying to buy';

const INSUFFICIENT_DEPOSIT = 'Insufficient Deposit';
const INSUFFICIENT_AMOUNT = 'Insufficient Amount';

module.exports = {
  USERNAME_EXIST,
  INVALID_ARGUMENT,
  USER_CREATION_ERROR,
  USER_NOT_FOUND,
  NO_UPDATE_ARGUMENT,
  USER_UPDATE_ERROR,
  USER_DELETE_ERROR,
  PRODUCTNAME_EXIST,
  PRODUCT_CREATION_ERROR,
  PRODUCT_UPDATE_ERROR,
  PRODUCT_DELETE_ERROR,
  PRODUCT_NOT_FOUND,
  INVALID_CREDENTIALS,
  BUYER,
  SELLER,
  UNAUTHORIZED_PRODUCT,
  UNAUTHORIZED_DEPOSIT,
  DEPOSIT_ERROR,
  DEPOSIT_RESET_ERROR,
  UNAUTHORIZED_BUY,
  INSUFFICIENT_DEPOSIT,
  INSUFFICIENT_AMOUNT,
  BUY_ERROR,
};
