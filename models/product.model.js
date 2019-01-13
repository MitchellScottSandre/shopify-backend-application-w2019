const productsFileName = '../data/products.json';
const cartsDataFileName = '../data/carts.json';
const utils = require('../utils');

function getProducts() {
  const products = getProductsData();
  return new Promise((resolve, reject) => {
    resolve(products.filter(p => p.inventory_count > 0));
  });
}

function getProductById(id) {
  const products = getProductsData();
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

function createProduct(product) {
  let products = getProductsData();
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

function getProductsData() {
  return utils.readFromFile('data/products.json');
}

function getNextProductId() {
  const products = getProductsData();
  return products.length + 1;
}

function isValidProductId(id) {
  const products = getProductsData();
  return id >= 1 && id <= products.length;
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  isValidProductId,
  writeProducts,
  getProductsData
};
