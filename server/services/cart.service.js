const db = require('../db');

class CartServices {
  async createOrder(order) {
    const newOrder = await db.query(
      'INSERT INTO "order" (email, name, phone_number, datetime) values ($1, $2, $3, $4) RETURNING *',
      [order.name, order.email, order.phone, order.datetime],
    );
    const orders = await Promise.all(
      order.cart.map(
        async (cartItem) =>
          await db.query(
            'INSERT INTO order_clothes (order_id, clothes_id, size_id, amount) values ($1, $2, $3, $4) RETURNING *',
            [
              newOrder.rows[0].id,
              cartItem.id,
              cartItem.size.id,
              cartItem.count,
            ],
          ),
      ),
    );
  }
}

module.exports = new CartServices();
