const Router = require('express');
const router = new Router();
const cartController = require('../controller/cart.controller');

router.post('/cart', cartController.createOrder);

module.exports = router;
