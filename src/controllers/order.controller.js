const { CreateRequestSuccess } = require("../core/success.response");
const OrderService = require("../services/order.service");

class OrderController {
  static async orderByUser(req, res, next) {
    const { cartId, userId, shiping, status, payment } = req.body;
    const metadata = await OrderService.orderByUser({
      cartId,
      userId,
      shiping,
      status,
      payment,
    });
    new CreateRequestSuccess({ metadata, message: "Order success" }).send(res);
  }
  static async create() {
    const metadata = await OrderService.create();
  }
}
module.exports = OrderController;
