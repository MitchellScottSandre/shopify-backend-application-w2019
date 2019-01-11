const productsFileName = '../data/products.json';
const cartsDataFileName = '../data/carts.json';
const products = require(productsFileName);
const product = require('../models/product.model');
const cartsData = require(cartsDataFileName);
const utils = require('../utils');

function getCarts() {
  return new Promise((resolve, reject) => {
    let carts = cartsData.carts.map(cart => {
      let totalPrice = 0.0;
      const cartProducts = cart.product_ids.map(id => {
        const product = products[id - 1];
        totalPrice += product.price;
        return product;
      });
      return {
        ...cart,
        products: cartProducts,
        total_price: totalPrice
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
      return reject({
        message: 'Get Cart: Invalid cart ID provided',
        status: 404
      });
    }

    const cart = cartsData.carts.find(c => c.id == id);
    let totalPrice = 0.0;
    const cartProducts = cart.product_ids.map(id => {
      const product = products[id - 1];
      totalPrice += product.price;
      return product;
    });

    resolve({
      ...cart,
      products: cartProducts,
      total_price: totalPrice
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
      return reject({
        message: 'Set Selected Cart: Invalid cart ID provided',
        status: 404
      });
    }

    cartsData.selected_cart_id = id;

    writeCartsData();

    resolve();
  });
}

function addProductToCart(productId) {
  return new Promise((resolve, reject) => {
    if (!product.isValidProductId(productId)) {
      return reject({
        message: 'Add Product to Cart: Invalid Product ID',
        status: 404
      });
    }

    if (!selectedCartExists()) {
      return reject({
        message: 'Add Product to Cart: No Cart is Selected',
        status: 404
      });
    }

    if (products[productId - 1].inventory_count == 0) {
      return reject({
        message: 'Add Product to Cart: no inventory for this product',
        status: 404
      });
    }

    const selectedID = cartsData.selected_cart_id;
    const prevProductIDs = cartsData.carts[selectedID - 1].product_ids;

    cartsData.carts[selectedID - 1] = {
      ...cartsData.carts[selectedID - 1],
      product_ids: [...prevProductIDs, productId]
    };

    writeCartsData();

    resolve(cartsData.carts[selectedID - 1]);
  });
}

function checkoutCart(id) {
  return new Promise((resolve, reject) => {
    if (!isValidCartId(id)) {
      return reject({
        message: 'Checkout Cart: Invalid cart ID provided',
        status: 404
      });
    }

    if (!selectedCartExists()) {
      return reject({
        message: 'Checkout Cart: No Cart is Selected',
        status: 404
      });
    }

    if (!isSelectedCart(id)) {
      return reject({
        message: 'Checkout Cart: This is not the selected cart',
        status: 404
      });
    }
    const selectedCartID = cartsData.selected_cart_id;
    let newProducts = products;
    cartsData.carts[selectedCartID - 1].product_ids.forEach(productId => {
      newProducts[productId - 1].inventory_count--;
    });

    product.writeProducts(newProducts);

    resolve(cartsData.carts[selectedCartID - 1]);
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

function isSelectedCart(id) {
  return cartsData.selected_cart_id == id;
}

module.exports = {
  getCarts,
  createNewCart,
  getCartById,
  setSelectedCart,
  addProductToCart,
  checkoutCart
};
