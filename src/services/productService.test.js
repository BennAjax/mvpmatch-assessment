const productService = require('./productService');
const productRepository = require('../data/repository/productRepository');
const { INVALID_ARGUMENT, PRODUCTNAME_EXIST, NO_UPDATE_ARGUMENT } = require('../lib/constants');
const BadRequestError = require('../lib/errors/BadRequestError');

jest.mock('../data/repository/productRepository');

describe('productService', () => {
  describe('createProduct', () => {
    const product = {
      amountAvailable: 4,
      cost: 50,
      productName: 'Fanta',
      sellerId: 1,
    };

    test('should throw Invalid Argument', async () => {
      try {
        await productService.createProduct(2, 10, '', 1);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe(INVALID_ARGUMENT);
      }
    });

    test('should throw for existing productName', async () => {
      productRepository.findProductByName.mockImplementation(() => ({
        productName: 'fanta',
      }));

      try {
        await productService.createProduct(
          product.amountAvailable,
          product.cost,
          product.productName,
          product.sellerId
        );
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestError);
        expect(e.message).toBe(PRODUCTNAME_EXIST);
      }
    });

    test('should create a product', async () => {
      productRepository.findProductByName.mockImplementation(() => null);
      await productService.createProduct(product.amountAvailable, product.cost, product.productName, product.sellerId);

      expect(productRepository.createProduct).toBeCalledTimes(1);
      expect(productRepository.createProduct).toBeCalledWith(
        expect.objectContaining({
          amountAvailable: product.amountAvailable,
          cost: product.cost,
          productName: product.productName,
          sellerId: product.sellerId,
        })
      );
    });
  });

  describe('getProducts', () => {
    test('should get all products', async () => {
      productRepository.findProducts.mockImplementation(() => Promise.resolve([{}]));
      await productService.getProducts();
      expect(productRepository.findProducts).toBeCalledTimes(1);
    });
  });

  describe('getProductById', () => {
    test('should throw Invalid Argument', async () => {
      try {
        await productService.getProductById();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe(INVALID_ARGUMENT);
      }
    });

    test('should return a product', async () => {
      productRepository.findProductById.mockImplementation(() => Promise.resolve({}));

      const id = 3;
      await productService.getProductById(id);
      expect(productRepository.findProductById).toBeCalledTimes(1);
      expect(productRepository.findProductById).toBeCalledWith(id);
    });
  });

  describe('getProductsBySellerId', () => {
    test('should throw Invalid Argument', async () => {
      try {
        await productService.getProductsBySellerId();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe(INVALID_ARGUMENT);
      }
    });

    test('should return a product', async () => {
      productRepository.findProductsBySellerId.mockImplementation(() => Promise.resolve({}));

      const id = 3;
      await productService.getProductsBySellerId(id);
      expect(productRepository.findProductsBySellerId).toBeCalledTimes(1);
      expect(productRepository.findProductsBySellerId).toBeCalledWith(id);
    });
  });

  describe('updateProduct', () => {
    test('should throw Invalid Argument', async () => {
      try {
        await productService.updateProduct();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe(INVALID_ARGUMENT);
      }
    });

    test('should throw No Update Arguments', async () => {
      try {
        await productService.updateProduct(1, null);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestError);
        expect(e.message).toBe(NO_UPDATE_ARGUMENT);
      }
    });

    test('should update a product', async () => {
      productRepository.updateProduct.mockImplementation(() => null);

      const product = {
        id: 3,
        amountAvailable: 2,
      };

      await productService.updateProduct(product.id, product.amountAvailable);
      expect(productRepository.updateProduct).toBeCalledTimes(1);
      expect(productRepository.updateProduct).toBeCalledWith(product.id, { amountAvailable: product.amountAvailable });
    });
  });

  describe('deleteProduct', () => {
    test('should throw Invalid Argument', async () => {
      try {
        await productService.deleteProduct();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe(INVALID_ARGUMENT);
      }
    });

    test('should delete a product', async () => {
      productRepository.deleteProduct.mockImplementation(() => null);

      const product = {
        id: 3,
      };

      await productService.deleteProduct(product.id);
      expect(productRepository.deleteProduct).toBeCalledTimes(1);
      expect(productRepository.deleteProduct).toBeCalledWith(product.id);
    });
  });
});
