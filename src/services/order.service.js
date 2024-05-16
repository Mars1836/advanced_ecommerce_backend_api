const { BadRequestError, ErrorResponse } = require("../core/error.response");
const orderModel = require("../models/order.model");
const OrderRepo = require("../models/repositories/order.repo");
const { generateTrackNumber } = require("../utils");
const RedisService = require("./redis.service");

class OrderService {
  static async orderByUser({ userId }, { shiping, status, payment }) {
    const checkoutStr = await RedisService.getCheckout({ userId });
    if (!checkoutStr) {
      throw new BadRequestError("Checkout first");
    }
    const checkout = JSON.parse(checkoutStr);
    const orderProducts = checkout.shopOrderIdsEnd.flatMap((item) => {
      return item.products;
    });
    const checkList = [];

    for (const product of orderProducts) {
      const { spuId, skuId } = product;
      const productIdOb = skuId ? { spuId, skuId } : { spuId };
      const keyLock = await RedisService.acquireKey({
        productIdOb,
        userId,
        quantity: product.quantity,
      });
      checkList.push(keyLock ? true : false);
      if (keyLock) {
        await RedisService.releaseKey(keyLock);
      }
    }
    console.log(checkList);
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
    await RedisService.releaseCheckout({ userId });
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
