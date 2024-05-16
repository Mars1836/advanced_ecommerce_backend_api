const InventoryRepo = require("../models/repositories/inventory.repo");
const redisClientIn = require("../redis");
class RedisService {
  static async acquireKey({ productIdOb, userId, quantity }) {
    const { skuId, spuId } = productIdOb;
    const expireTime = 3;
    const retryTimes = 10;
    const key = skuId
      ? `lock_v1_${spuId}_${skuId}`
      : `lock_v1_${spuId}_${skuId}`;
    for (let i = 0; i < retryTimes; i++) {
      const setKey = await redisClientIn.setNX(key, key);

      if (setKey) {
        const result = await InventoryRepo.reservation({
          quantity,
          productIdOb,
          userId,
        });
        if (result) {
          await redisClientIn.expire(key, expireTime);
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
    const key = `check_out_${checkout.userId}`;
    const set = await redisClientIn.set(key, JSON.stringify(checkout));
    await redisClientIn.expire(key, 180);
    return set;
  }
  static async getCheckout({ userId }) {
    const key = `check_out_${userId}`;
    console.log(key);
    return await redisClientIn.get(key);
  }
  static async releaseCheckout({ userId }) {
    const key = `check_out_${userId}`;

    return await redisClientIn.del(key);
  }
}
module.exports = RedisService;
