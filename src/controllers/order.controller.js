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
  static async getOrdersByUser(req, res, next) {
    const metadata = await OrderService.getOrdersByUser(
      { userId: req.user.ob.id },
      req.query
    );
    new CreateRequestSuccess({ metadata, message: "Get orders success" }).send(
      res
    );
  }
  static async updateStatus(req, res, next) {
    const metadata = await OrderService.updateStatus(
      { shopId: req.shop.ob.id },
      {
        ...req.body,
      }
    );
    new CreateRequestSuccess({
      metadata,
      message: "Update order success",
    }).send(res);
  }
}
module.exports = OrderController;
