const supertest = require('supertest');
const httpStatus = require('http-status');
const app = require('../server');
const db = require('../data/models/init');
const userRepository = require('../data/repository/userRepository');
const { createUserCrendential } = require('../__tests__/helpers');
const { INVALID_CREDENTIALS, BUYER, USERNAME_EXIST } = require('../lib/constants');

const request = supertest(app);

jest.setTimeout(20000);

afterAll(async () => {
  await db.sequelize.sync();
  await db.users.sync({ force: true });
  await db.sequelize.close();
  app.close();
});

describe('User Controller', () => {
  let credentials;
  let user;

  describe('GET: Health', () => {
    test('should return 200 for health', () => {
      request
        .get('/health')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.status).toBe('OK');
        });
    });
  });

  describe('POST: Login', () => {
    test('should return 400 when validation fails', () => {
      request
        .post('/login')
        .send({ usernam: 'test', password: 'test' })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.status).toBe('Validation Error');
        });
    });

    test('should return 400 when credentials are invalid', () => {
      request
        .post('/login')
        .send({ username: 'test', password: 'test' })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.status).toBe(INVALID_CREDENTIALS);
        });
    });

    test('should return 200 when credentials are valid', async () => {
      credentials = await createUserCrendential(BUYER);
      request
        .post('/login')
        .send({ ...credentials })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.token).toBeTruthy();
        });
    });
  });

  describe('POST: Users', () => {
    test('should return 400 when validation fails', () => {
      request
        .post('/users')
        .send({ username: 'test', password: 'test' })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.status).toBe('Validation Error');
          expect(res.body.details[0].message).toBe('"role" is required');
        });
    });

    test('should return 400 when username already exist', () => {
      request
        .post('/users')
        .send({ username: 'test-user', password: 'test', role: BUYER })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.status).toBe(USERNAME_EXIST);
        });
    });

    test('should create a new user', () => {
      request
        .post('/users')
        .send({ username: 'test-user3', password: 'test', role: BUYER })
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.status).toBe('Successful');
        });
    });
  });

  describe('GET: Users', () => {
    test('should get all users', () => {
      request
        .get('/users')
        .set('Authorization', `Bearer ${credentials.token}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    test('should get user by id', async () => {
      user = await userRepository.findUsers();
      const res = await request
        .get(`/users/${user[0].id}`)
        .set('Authorization', `Bearer ${credentials.token}`)
        .expect(httpStatus.OK);

      expect(res.body.id).toBe(user[0].id);
      expect(res.body.username).toBe(user[0].username);
      expect(res.body.deposit).toBe(user[0].deposit);
    });
  });

  describe('PUT: Users', () => {
    test('should update a user', async () => {
      const update = { username: 'updated-user' };
      await request
        .put(`/users/${user[0].id}`)
        .set('Authorization', `Bearer ${credentials.token}`)
        .send(update)
        .expect(httpStatus.OK);

      const updatedUser = await userRepository.findUserById(user[0].id);
      expect(updatedUser.id).toBe(user[0].id);
      expect(updatedUser.username).toBe(update.username);
      expect(updatedUser.deposit).toBe(user[0].deposit);
    });
  });

  describe('DELETE: Users', () => {
    test('should update a user', async () => {
      await request
        .delete(`/users/${user[0].id}`)
        .set('Authorization', `Bearer ${credentials.token}`)
        .expect(httpStatus.OK);

      const deletedUser = await userRepository.findUserById(user[0].id);
      expect(deletedUser).toBeNull();
    });
  });
});
