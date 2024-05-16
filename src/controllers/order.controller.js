const { CreateRequestSuccess } = require("../core/success.response");
const OrderService = require("../services/order.service");

class OrderController {
  static async orderByUser(req, res, next) {
    const { cartId, shiping, status, payment } = req.body;
    const metadata = await OrderService.orderByUser(
      { userId: req.user.ob.id },
      {
        shiping,
        status,
        payment,
      }
    );
    new CreateRequestSuccess({ metadata, message: "Order success" }).send(res);
  }
  static async create() {
    const metadata = await OrderService.create();
  }
}
module.exports = OrderController;
