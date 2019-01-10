const cartsDataFileName = '../data/carts.json';
const cartsData = require(cartsDataFileName);
const utils = require('../utils');

function getCarts() {
  return new Promise((resolve, reject) => {
    resolve(cartsData);
  });
}

function getCartById(id) {
  return new Promise((resolve, reject) => {
    if (!isValidCartId(id)) {
      reject({
        message: 'Get Cart: Invalid cart ID provided',
        status: 404
      });

      return;
    }

    const cart = cartsData.carts.find(c => c.id == id);

    resolve(cart);
  });
}

function createNewCart(cartName) {
  return new Promise((resolve, reject) => {
    const newCart = {
      id: getNextCartId(),
      name: cartName,
      product_ids: [],
      total_price: 0.0
    };

    cartsData.carts.push(newCart);

    writeCartsData();

    resolve();
  });
}

function setSelectedCart(id) {
  return new Promise((resolve, reject) => {
    if (!isValidCartId(id)) {
      reject({
        message: 'Set Selected Cart: Invalid cart ID provided',
        status: 404
      });

      return;
    }

    cartsData.selected_cart_id = id;

    writeCartsData();

    resolve();
  });
}

// Helper Functions

function isValidCartId(id) {
  return id >= 1 && id <= cartsData.carts.length;
}

function getNextCartId() {
  return cartsData.carts.length + 1;
}

function writeCartsData() {
  utils.writeToFile('data/carts.json', cartsData);
}

module.exports = {
  getCarts,
  createNewCart,
  getCartById,
  setSelectedCart
};
