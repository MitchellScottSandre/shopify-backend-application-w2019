const express = require('express');
const router = express.Router();
const cart = require('../models/cart.model');
const utils = require('../utils');

router.get('/', async (req, res) => {
  await cart
    .getCarts()
    .then(carts => res.json(carts))
    .catch(err => {
      utils.handleError(err, res);
    });
});

router.post('/', async (req, res) => {
  await cart
    .createNewCart(req.body.name)
    .then(cart => res.json(cart))
    .catch(err => {
      utils.handleError(err, res);
    });
});

module.exports = router;
