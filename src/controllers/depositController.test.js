const supertest = require('supertest');
const httpStatus = require('http-status');
const app = require('../server');
const db = require('../data/models/init');
const userRepository = require('../data/repository/userRepository');
const { createUserCrendential } = require('../__tests__/helpers');
const { BUYER, SELLER, UNAUTHORIZED_DEPOSIT } = require('../lib/constants');

const request = supertest(app);

jest.setTimeout(20000);

afterAll(async () => {
  await db.sequelize.sync();
  await db.users.sync({ force: true });
  await db.sequelize.close();
  app.close();
});

describe('Deposit Controller', () => {
  let credentials;
  describe('Deposit Coin', () => {
    test('should return 400 when no token is provided', () => {
      request
        .post('/deposit')
        .send({ coin: 100 })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.status).toBe('No token provided');
        });
    });

    test('should return 400 when token is invalid', () => {
      request
        .post('/deposit')
        .set('Authorization', 'Bearer xxxxxxx')
        .send({ coin: 100 })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.status).toBe('Invalid token');
        });
    });

    test('should return 400 when validation fails', async () => {
      credentials = await createUserCrendential(BUYER);
      request
        .post('/deposit')
        .set('Authorization', `Bearer ${credentials.token}`)
        .send({ coins: 100 })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.status).toBe('Validation Error');
        });
    });

    test('should return 400 when a wrong coin is deposited', () => {
      request
        .post('/deposit')
        .set('Authorization', `Bearer ${credentials.token}`)
        .send({ coin: 48 })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.status).toBe('Validation Error');
          expect(res.body.details[0].message).toBe('"coin" must be one of [5, 10, 20, 50, 100]');
        });
    });

    test('should return 401 when a seller try to deposit', async () => {
      const seller = await createUserCrendential(SELLER, 'test-user2');
      request
        .post('/deposit')
        .set('Authorization', `Bearer ${seller.token}`)
        .send({ coin: 50 })
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.status).toBe(UNAUTHORIZED_DEPOSIT);
        });
    });

    test('should deposit coin', async () => {
      const init = async (coin) =>
        request
          .post('/deposit')
          .set('Authorization', `Bearer ${credentials.token}`)
          .send({ coin })
          .expect(httpStatus.CREATED);

      await init(100);
      await init(20);

      const result = await userRepository.findUserByUsername(credentials.username);
      expect(result.deposit).toBe(120);
    });
  });

  describe('Reset Deposit', () => {
    test('should reset deposit to zero', async () => {
      await request
        .post('/deposit')
        .set('Authorization', `Bearer ${credentials.token}`)
        .send({ coin: 100 })
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.status).toBe('Successful');
        });

      await request.post('/reset').set('Authorization', `Bearer ${credentials.token}`).expect(httpStatus.OK);

      const result = await userRepository.findUserByUsername(credentials.username);
      expect(result.deposit).toBe(0);
    });
  });
});
