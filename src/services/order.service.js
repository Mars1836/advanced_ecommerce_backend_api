const { BadRequestError, ErrorResponse } = require("../core/error.response");
const orderModel = require("../models/order.model");
const OrderRepo = require("../models/repositories/order.repo");
const { generateTrackNumber } = require("../utils");
const RedisService = require("./redis.service");

class OrderService {
  static async orderByUser({ cartId, userId, shiping, status, payment }) {
    const checkoutStr = await RedisService.getCheckout({ userId, cartId });
    if (!checkoutStr) {
      throw new BadRequestError("Checkout first");
    }
    const checkout = JSON.parse(checkoutStr);
    const orderProducts = checkout.shopOrderIdsEnd.flatMap((item) => {
      return item.products;
    });
    const checkList = [];
    for (const product of orderProducts) {
      const keyLock = await RedisService.acquireKey({
        productId: product.productId,
        cartId,
        userId,
        quantity: product.quantity,
      });
      checkList.push(keyLock ? true : false);
      if (keyLock) {
        await RedisService.releaseKey(keyLock);
      }
    }
    if (checkList.includes(false)) {
      checkList.forEach((bol, index) => {
        if (!bol) {
          console.log(orderProducts[index]);
        }
      });
      throw new BadRequestError(
        "Some product is updated, please check your cart"
      );
    }
    const trackingNumber = generateTrackNumber();
    const order = await orderModel.create({
      cartId,
      userId,
      shiping,
      status,
      trackingNumber,
      payment,
      checkout: checkout.checkOrder,
      products: orderProducts,
    });
    if (!order) {
      throw ErrorResponse("Make order error");
    }
    await RedisService.releaseCheckout({ userId, cartId });
    return order;
  }

  static async getOrdersByUser(
    { userId },
    { page, sort, skip, limit, select, unSelect }
  ) {
    return await OrderRepo.findAllByQuery(
      { userId },
      { page, sort, skip, limit, select, unSelect }
    );
  }
  static async getOrderById({ orderId }) {
    return await OrderRepo.findOne({ _id: orderId }).lean();
  }
  static async cancelOrder({ orderId }) {
    const updateOrder = await orderModel.updateOne(
      { orderId },
      {
        $set: {
          status: "canceled",
        },
      }
    );
    return updateOrder;
  }
  static async updateOrderStatusByShop() {}
}
module.exports = OrderService;
