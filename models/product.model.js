const products = require('../data/products.json');

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
    const product = products.find(p => p.id == id);
    resolve(product);
  });
}

module.exports = {
  getProducts,
  getProductById
};
