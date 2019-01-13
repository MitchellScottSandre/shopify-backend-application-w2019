const productsFileName = '../data/products.json';
const product = require('../models/product.model');
const utils = require('../utils');

function getCarts() {
  const cartsData = getCartsData();
  const products = product.getProductsData();

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
  const cartsData = getCartsData();
  const products = product.getProductsData();
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
  let cartsData = getCartsData();
  return new Promise((resolve, reject) => {
    const newCart = {
      id: getNextCartId(),
      name: cartName,
      product_ids: [],
      total_price: 0.0
    };

    cartsData.carts.push(newCart);

    writeCartsData(cartsData);

    resolve();
  });
}

function setSelectedCart(id) {
  let cartsData = getCartsData();
  return new Promise((resolve, reject) => {
    if (!isValidCartId(id)) {
      return reject({
        message: 'Set Selected Cart: Invalid cart ID provided',
        status: 404
      });
    }

    cartsData.selected_cart_id = id;

    writeCartsData(cartsData);

    resolve();
  });
}

function addProductToCart(productId) {
  let cartsData = getCartsData();
  const products = product.getProductsData();
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

    writeCartsData(cartsData);

    resolve(cartsData.carts[selectedID - 1]);
  });
}

function checkoutCart(id) {
  let cartsData = getCartsData();
  const products = product.getProductsData();
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

function getCartsData() {
  return utils.readFromFile('data/carts.json');
}

function isValidCartId(id) {
  return id >= 1 && id <= getCartsData().carts.length;
}

function getNextCartId() {
  return getCartsData().carts.length + 1;
}

function writeCartsData(data) {
  utils.writeToFile('data/carts.json', data);
}

function selectedCartExists() {
  return getCartsData().selected_cart_id != null;
}

function isSelectedCart(id) {
  return getCartsData().selected_cart_id == id;
}

module.exports = {
  getCarts,
  createNewCart,
  getCartById,
  setSelectedCart,
  addProductToCart,
  checkoutCart,
  writeCartsData
};
