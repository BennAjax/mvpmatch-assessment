const supertest = require('supertest');
const httpStatus = require('http-status');
const app = require('../server');
const db = require('../data/models/init');
const userRepository = require('../data/repository/userRepository');
const productRepository = require('../data/repository/productRepository');
const { createUserCrendential, createProduct } = require('../__tests__/helpers');
const { BUYER, SELLER, UNAUTHORIZED_BUY, INSUFFICIENT_AMOUNT, INSUFFICIENT_DEPOSIT } = require('../lib/constants');

const request = supertest(app);

jest.setTimeout(20000);

afterAll(async () => {
  await db.sequelize.sync();
  await db.users.sync({ force: true });
  await db.products.sync({ force: true });
  await db.sequelize.close();
  app.close();
});

describe('Buy Controller', () => {
  let buyer;
  let seller;
  let product;

  test('should return 400 when validation fails', async () => {
    seller = await createUserCrendential(SELLER, 'test-user4');
    request
      .post('/buy')
      .set('Authorization', `Bearer ${seller.token}`)
      .send({ productId: 1 })
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.status).toBe('Validation Error');
        expect(res.body.details[0].message).toBe('"amount" is required');
      });
  });

  test('should return 401 when a seller try to buy', async () => {
    request
      .post('/buy')
      .set('Authorization', `Bearer ${seller.token}`)
      .send({ productId: 1, amount: 1 })
      .expect(httpStatus.UNAUTHORIZED)
      .then((res) => {
        expect(res.body.status).toBe(UNAUTHORIZED_BUY);
      });
  });

  test('should return 400 when quantity is greater than available quantity', async () => {
    const sellerDetails = await userRepository.findUserByUsername(seller.username);
    await createProduct('Fanta', sellerDetails.id);
    buyer = await createUserCrendential(BUYER, 'test-user', 120);
    product = await productRepository.findProductByName('Fanta');

    request
      .post('/buy')
      .set('Authorization', `Bearer ${buyer.token}`)
      .send({ productId: product.id, amount: 8 })
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.status).toBe(INSUFFICIENT_AMOUNT);
      });
  });

  test('should return 400 when deposit is less than total cost', async () => {
    request
      .post('/buy')
      .set('Authorization', `Bearer ${buyer.token}`)
      .send({ productId: product.id, amount: 4 })
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.status).toBe(INSUFFICIENT_DEPOSIT);
      });
  });

  test('should buy a product', async () => {
    request
      .post('/buy')
      .set('Authorization', `Bearer ${buyer.token}`)
      .send({ productId: product.id, amount: 2 })
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.totalCost).toBe(100);
        expect(res.body.product).toBe('Fanta');
        expect(res.body.change).toBe(20);
      });
  });
});
