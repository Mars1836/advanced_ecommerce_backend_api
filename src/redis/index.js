const Producer = require("../../producer");
const { redisdb } = require("../configs/config.redisdb");
const redis = require("redis");

const redisClient = redis.createClient({
  url: `redis://${redisdb.host}:${redisdb.port}`,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
(async function () {
  await redisClient.connect();
})();

class RedisClient {
  constructor() {
    this.test = 1;
    if (RedisClient.instance) {
      return RedisClient.instance;
    }

    RedisClient.instance = this;
  }

  async set(key, value) {
    return await redisClient.set(key, value);
  }
  async setNX(key, value) {
    return await redisClient.setNX(key, value);
  }
  async get(key) {
    const producer = new Producer();
    await producer.createChannel();
    await producer.publicMessage({ name: "hauvu", age: "21" });
    return await redisClient.get(key);
  }
  async hset(hash, key, value) {
    return await redisClient.hSet(hash, key, value);
  }
  async incyBy(key, number = 1) {
    return await redisClient.incrBy(key, number);
  }
  async exist(key) {
    return await redisClient.exists(key);
  }
  async expire(key, seconds) {
    return await redisClient.expire(key, seconds);
  }
  async del(key) {
    return await redisClient.del(key);
  }
}
const redisClientIn = new RedisClient();
module.exports = redisClientIn;
