const cartsDataFileName = '../data/carts.json';
const cartsData = require(cartsDataFileName);
const utils = require('../utils');

function getCarts() {
  return new Promise((resolve, reject) => {
    resolve(cartsData);
  });
}

function createNewCart(cartName) {
  console.log('create cart called', cartName);
  return new Promise((resolve, reject) => {
    const newCart = {
      id: getNextCartId(),
      name: cartName,
      product_ids: [],
      total_price: 0.0
    };

    cartsData.carts.push(newCart);

    writeCartsData();

    resolve(newCart);
  });
}

// Helper Functions

function getNextCartId() {
  return cartsData.carts.length + 1;
}

function writeCartsData() {
  utils.writeToFile('data/carts.json', cartsData);
}

module.exports = {
  getCarts,
  createNewCart
};
