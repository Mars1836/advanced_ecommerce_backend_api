const InventoryRepo = require("../models/repositories/inventory.repo");
const redisClientIn = require("../redis");
class RedisService {
  static async acquireKey({ productId, cartId, userId, quantity }) {
    const expireTime = 3;
    const retryTimes = 10;
    const key = `lock_v1_${productId}`;
    for (let i = 0; i < retryTimes; i++) {
      const setKey = await redisClientIn.setNX(key, key);
      await redisClientIn.expire(key, expireTime);
      if (setKey) {
        const result = await InventoryRepo.reservation({
          quantity,
          productId,
          userId,
          cartId,
        });
        console.log("modifiedCount", result);
        if (result) {
          return key;
        }
        return null;
      } else {
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });
      }
    }
  }
  static async releaseKey(key) {
    return await redisClientIn.del(key);
  }
  static async storeCheckout(checkout) {
    const key = `check_out_${checkout.cartId}-${checkout.userId}`;
    const set = await redisClientIn.set(key, JSON.stringify(checkout));
    await redisClientIn.expire(key, 180);
    return set;
  }
  static async getCheckout({ userId, cartId }) {
    const key = `check_out_${cartId}-${userId}`;
    console.log(key);
    return await redisClientIn.get(key);
  }
  static async releaseCheckout({ userId, cartId }) {
    const key = `check_out_${cartId}-${userId}`;

    return await redisClientIn.del(key);
  }
}
module.exports = RedisService;
