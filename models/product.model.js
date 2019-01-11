const productsFileName = '../data/products.json';
const cartsDataFileName = '../data/carts.json';
const products = require(productsFileName);
const utils = require('../utils');

function getProducts() {
  return new Promise((resolve, reject) => {
    resolve(products.filter(p => p.inventory_count > 0));
  });
}

function getProductById(id) {
  return new Promise((resolve, reject) => {
    if (!isValidProductId(id)) {
      return reject({
        message: 'Get Product: Invalid product ID provided',
        status: 404
      });
    }

    const product = products.find(p => p.id == id);

    resolve(product);
  });
}

function purchaseProductById(id) {
  return new Promise((resolve, reject) => {
    if (!isValidProductId(id)) {
      return reject({
        message: 'Purchase Product: Invalid product ID provided',
        status: 404
      });
    }

    let product = products.find(p => p.id == id);

    if (product.inventory_count == 0) {
      return reject({
        message: 'Purchase Product: Product inventory count is 0',
        status: 404
      });
    }

    product.inventory_count--;

    products[product.id - 1] = product;

    writeProducts(products);

    resolve(product);
  });
}

function createProduct(product) {
  return new Promise((resolve, reject) => {
    if (!isValidPostProduct(product)) {
      return reject({
        message: 'Create Product: Invalid Product',
        status: 404
      });
    }
    const newProduct = {
      id: getNextProductId(),
      ...product
    };

    products.push(newProduct);

    writeProducts(products);

    resolve(newProduct);
  });
}

// Helper Functions

function isValidPostProduct(product) {
  return (
    product.hasOwnProperty('title') &&
    product.hasOwnProperty('price') &&
    product.hasOwnProperty('inventory_count')
  );
}

function writeProducts(data) {
  utils.writeToFile('data/products.json', data);
}

function getNextProductId() {
  return products.length + 1;
}

function isValidProductId(id) {
  return id >= 1 && id <= products.length;
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  purchaseProductById,
  isValidProductId,
  writeProducts
};
