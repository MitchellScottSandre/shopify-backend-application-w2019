const fs = require('fs');
const productsFileName = './data/products.json';
const cartsDataFileName = './data/carts.json';
const products = require(productsFileName);
const cartsData = require(cartsDataFileName);

function handleError(err, res) {
  if (err.status) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: err.message });
  }
}

function writeToFile(fileName, data) {
  fs.writeFileSync(fileName, JSON.stringify(data), 'utf8', error => {
    console.log(error);
  });
}

function isValidProductId(id) {
  return id >= 1 && id <= products.length;
}

module.exports = {
  handleError,
  writeToFile,
  isValidProductId
};
