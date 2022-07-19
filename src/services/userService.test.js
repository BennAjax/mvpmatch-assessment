const userService = require('./userService');
const userRepository = require('../data/repository/userRepository');
const { INVALID_ARGUMENT, USERNAME_EXIST, NO_UPDATE_ARGUMENT } = require('../lib/constants');
const BadRequestError = require('../lib/errors/BadRequestError');

jest.mock('../data/repository/userRepository');

describe('User Service', () => {
  describe('generateHash', () => {
    test('should throw Invalid Arguments', async () => {
      try {
        await userService.generateHash();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe(INVALID_ARGUMENT);
      }
    });

    test('should generate hash', async () => {
      const hash = await userService.generateHash('qwerty12');
      expect(hash).toBeTruthy();
      expect(hash).toMatch(/^\$2a\$10/);
    });
  });

  describe('createUser', () => {
    const user = {
      username: 'james12',
      password: 'qwerty12',
      role: 'buyer',
    };

    test('should throw Invalid Argument', async () => {
      try {
        await userService.createUser('joe12', 'xxxx');
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe(INVALID_ARGUMENT);
      }
    });

    test('should throw for existing user', async () => {
      userRepository.findUserByUsername.mockImplementation(() => ({
        username: 'brownfox',
      }));

      try {
        await userService.createUser(user.username, user.password, user.role);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestError);
        expect(e.message).toBe(USERNAME_EXIST);
      }
    });

    test('should create a user', async () => {
      userRepository.findUserByUsername.mockImplementation(() => null);
      await userService.createUser(user.username, user.password, user.role);

      expect(userRepository.createUser).toBeCalledTimes(1);
      expect(userRepository.createUser).toBeCalledWith(
        expect.objectContaining({
          username: user.username,
          role: user.role,
          deposit: 0,
        })
      );
    });
  });

  describe('getUsers', () => {
    test('should get all users', async () => {
      userRepository.findUsers.mockImplementation(() => Promise.resolve([{}]));
      await userService.getUsers();
      expect(userRepository.findUsers).toBeCalledTimes(1);
    });
  });

  describe('getUserById', () => {
    test('should throw Invalid Argument', async () => {
      try {
        await userService.getUserById();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe(INVALID_ARGUMENT);
      }
    });

    test('should return a user', async () => {
      userRepository.findUserById.mockImplementation(() =>
        Promise.resolve({
          dataValues: { id: 1, username: 'shalomkeys', password: 'xxxxxxxxx', deposit: 0, role: 'seller' },
        })
      );

      const id = 3;
      await userService.getUserById(id);
      expect(userRepository.findUserById).toBeCalledTimes(1);
      expect(userRepository.findUserById).toBeCalledWith(id);
    });
  });

  describe('updateUser', () => {
    test('should throw Invalid Argument', async () => {
      try {
        await userService.updateUser();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe(INVALID_ARGUMENT);
      }
    });

    test('should throw No Update Arguments', async () => {
      try {
        await userService.updateUser(1, null);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestError);
        expect(e.message).toBe(NO_UPDATE_ARGUMENT);
      }
    });

    test('should update a user', async () => {
      userRepository.updateUser.mockImplementation(() => null);

      const user = {
        id: 3,
        username: 'shalomite',
      };

      await userService.updateUser(user.id, user.username);
      expect(userRepository.updateUser).toBeCalledTimes(1);
      expect(userRepository.updateUser).toBeCalledWith(user.id, { username: user.username });
    });
  });

  describe('deleteUser', () => {
    test('should throw Invalid Argument', async () => {
      try {
        await userService.deleteUser();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe(INVALID_ARGUMENT);
      }
    });

    test('should delete a user', async () => {
      userRepository.deleteUser.mockImplementation(() => null);

      const user = {
        id: 3,
      };

      await userService.deleteUser(user.id);
      expect(userRepository.deleteUser).toBeCalledTimes(1);
      expect(userRepository.deleteUser).toBeCalledWith(user.id);
    });
  });
});
