const productsFileName = '../data/products.json';
const products = require(productsFileName);
const utils = require('../utils/utils');

function getProducts() {
  return new Promise((resolve, reject) => {
    resolve(products.filter(p => p.inventory_count > 0));
  });
}

function getProductById(id) {
  return new Promise((resolve, reject) => {
    if (!isValidProductId(id)) {
      reject({
        message: 'Get Product: Invalid product ID provided',
        status: 404
      });

      return;
    }

    const product = products.find(p => p.id == id);

    resolve(product);
  });
}

function purchaseProductById(id) {
  return new Promise((resolve, reject) => {
    if (!isValidProductId(id)) {
      reject({
        message: 'Purchase Product: Invalid product ID provided',
        status: 404
      });

      return;
    }

    let product = products.find(p => p.id == id);

    if (product.inventory_count == 0) {
      reject({
        message: 'Purchase Product: Product inventory count is 0',
        status: 404
      });

      return;
    }

    product.inventory_count--;

    products[product.id - 1] = product;

    writeProducts();

    resolve(product);
  });
}

function createProduct(product) {
  return new Promise((resolve, reject) => {
    if (!isValidPostProduct(product)) {
      reject({
        message: 'Post Product: Invalid Product',
        status: 404
      });

      return;
    }
    const newProduct = {
      id: getNextProductId(),
      ...product
    };

    products.push(newProduct);

    writeProducts();

    resolve(newProduct);
  });
}

// Helper Functions

function isValidProductId(id) {
  return id >= 1 && id <= products.length;
}

function isValidPostProduct(product) {
  return (
    product.hasOwnProperty('title') &&
    product.hasOwnProperty('price') &&
    product.hasOwnProperty('inventory_count')
  );
}

function writeProducts() {
  utils.writeToFile('data/products.json', products); // file name is relative to process.cwd()
}

function getNextProductId() {
  return products.length + 1;
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  purchaseProductById
};
