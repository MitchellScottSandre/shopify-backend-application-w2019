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

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  await cart
    .getCartById(id)
    .then(cart => res.json(cart))
    .catch(err => {
      utils.handleError(err, res);
    });
});

router.post('/:id/select', async (req, res) => {
  const id = req.params.id;

  await cart
    .setSelectedCart(id)
    .then(cart => res.json(cart))
    .catch(err => {
      utils.handleError(err, res);
    });
});

router.post('/:id/checkout', async (req, res) => {
  const id = req.params.id;

  await cart
    .checkoutCart(id)
    .then(cart => res.json(cart))
    .catch(err => {
      utils.handleError(err, res);
    });
});

module.exports = router;
