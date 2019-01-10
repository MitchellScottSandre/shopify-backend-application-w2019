const productsFileName = '../data/products.json';
const products = require(productsFileName);
const utils = require('../utils/utils');

// TODO: return only products with available inventory
function getProducts() {
  return new Promise((resolve, reject) => {
    if (products.length === 0) {
      console.log('NO PRODUCTS');
    }

    resolve(products);
  });
}

function getProductById(id) {
  return new Promise((resolve, reject) => {
    if (!isValidProductId(id)) {
      reject({
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
      reject({
        message: 'Purchase Product: Invalid product ID provided',
        status: 404
      });
    }

    let product = products.find(p => p.id == id);

    if (product.inventory_count == 0) {
      reject({
        message: 'Purchase Product: Product inventory count is 0',
        status: 404
      });
    }

    product.inventory_count--;

    writeProduct(product);

    resolve(product);
  });
}

function isValidProductId(id) {
  return id >= 1 && id <= products.length;
}

function writeProduct(product) {
  products[product.id - 1] = product;
  utils.writeToFile('data/products.json', products); // file name is relative to process.cwd()
}

module.exports = {
  getProducts,
  getProductById,
  purchaseProductById
};
