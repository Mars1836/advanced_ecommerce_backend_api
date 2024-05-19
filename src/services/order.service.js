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
    const orderData = checkout.shopOrderIdsEnd.map((item) => {
      const trackingNumber = generateTrackNumber();
      return {
        shopId: item.shopId,
        userId,
        shiping,
        status,
        trackingNumber,
        payment,
        checkout: item.checkOrder,
        products: item.products,
      };
    });
    const orders = await orderModel.insertMany(orderData);
    // const order = await orderModel.create({
    //   userId,
    //   shiping,
    //   status,
    //   trackingNumber,
    //   payment,
    //   checkout: checkout.checkOrder,
    //   products: orderProducts,
    // });
    if (!orders) {
      throw ErrorResponse("Make order error");
    }
    await RedisService.releaseCheckout({ userId });
    return orders;
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
  static async updateStatus({ shopId }, { status, orderId }) {
    const query = {
      shopId,
      _id: orderId,
    };

    const order = await orderModel.findOne(query);
    if (!order) {
      throw new BadRequestError("The order provided does not exist.");
    }
    order.status = status;
    return await order.save();
  }
  static async updateOrderStatusByShop() {}
}

module.exports = OrderService;
