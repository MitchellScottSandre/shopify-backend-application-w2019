const express = require('express');
const router = express.Router();

router.use('/products', require('./product.routes'));
router.use('/carts', require('./cart.routes'));

module.exports = router;
