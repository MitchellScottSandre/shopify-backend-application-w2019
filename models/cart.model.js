const productsFileName = '../data/products.json';
const cartsDataFileName = '../data/carts.json';
const products = require(productsFileName);
const cartsData = require(cartsDataFileName);
const utils = require('../utils');

function getCarts() {
  return new Promise((resolve, reject) => {
    let carts = cartsData.carts.map(cart => {
      const cartProducts = cart.product_ids.map(id => products[id - 1]);
      return {
        ...cart,
        products: cartProducts
      };
    });

    resolve({
      selected_cart_id: cartsData.selected_cart_id,
      carts
    });
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
    const cartProducts = cart.product_ids.map(id => products[id - 1]);

    resolve({
      ...cart,
      products: cartProducts
    });
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

function addProductToCart(id) {
  return new Promise((resolve, reject) => {
    if (!utils.isValidProductId(id)) {
      reject({
        message: 'Add Product to Cart: Invalid Product ID',
        status: 404
      });

      return;
    }

    if (!selectedCartExists()) {
      reject({
        message: 'Add Product to Cart: No Cart is Selected',
        status: 404
      });

      return;
    }

    const selectedID = cartsData.selected_cart_id;
    const prevProductIDs = cartsData.carts[selectedID - 1].product_ids;

    cartsData.carts[selectedID - 1] = {
      ...cartsData.carts[selectedID - 1],
      product_ids: [...prevProductIDs, id]
    };

    //TODO: update total price

    writeCartsData();

    resolve(cartsData.carts[selectedID - 1]);
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

function selectedCartExists() {
  return cartsData.selected_cart_id != null;
}

module.exports = {
  getCarts,
  createNewCart,
  getCartById,
  setSelectedCart,
  addProductToCart
};
