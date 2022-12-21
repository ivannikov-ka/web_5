const cartServices = require('../services/cart.service.js');

class CartController {
  async createOrder(req, res) {
    const newOrder = await cartServices.createOrder(req.body);
    res.json(newOrder, 201);
  }
}

module.exports = new CartController();
