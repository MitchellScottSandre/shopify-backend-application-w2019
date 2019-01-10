const express = require('express');
const router = express.Router();
const product = require('../models/product.model');
const utils = require('../utils/utils');

// Get All Products
router.get('/', async (req, res) => {
  await product
    .getProducts()
    .then(products => res.json(products))
    .catch(err => {
      utils.handleError(err, res);
    });
});

router.get('/:id/purchase', async (req, res) => {
  const id = req.params.id;

  await product
    .purchaseProductById(id)
    .then(product => res.json(product))
    .catch(err => {
      utils.handleError(err, res);
    });
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  await product
    .getProductById(id)
    .then(product => res.json(product))
    .catch(err => {
      utils.handleError(err, res);
    });
});

module.exports = router;
