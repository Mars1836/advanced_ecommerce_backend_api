const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/async.handler");
const redisClientIn = require("../../redis");
//Testiggggggggggggggggggggggggggggg
const router = express.Router();

router.get(
  "/get",
  asyncHandler(async (req, res) => {
    const { key } = req.body;
    const re = await redisClientIn.get(key);
    res.json(re);
  })
);
router.get(
  "/setnx",
  asyncHandler(async (req, res) => {
    const { key, value } = req.body;
    const re = await redisClientIn.setNX(key, value);
    res.json(re);
  })
);
router.get(
  "/set",
  asyncHandler(async (req, res) => {
    const { key, value } = req.body;
    const re = await redisClientIn.set(key, value);
    res.json(re);
  })
);
router.get(
  "/hset",
  asyncHandler(async (req, res) => {
    const { hash, key, value } = req.body;
    const re = await redisClientIn.hset(hash, key, value);
    res.json(re);
  })
);
router.get("/order", async (req, res) => {
  const stock = 10;
  const keyName = "product";
  const stockExists = await redisClientIn.exist(keyName);
  if (!stockExists) {
    await redisClientIn.set(keyName, 0);
  }
  let sale = await redisClientIn.get(keyName);
  sale = await redisClientIn.incyBy(keyName);

  if (sale >= stock) {
    console.log(`order faild: out of stock ${sale - stock} products`);
    return res.json(`order faild: out of stock ${sale - stock} products`);
  }
  console.log("in sale", sale);

  if (sale > stock) {
    await redisClientIn.set("outstock", +sale - stock);
  }

  console.log(`order success: ${+sale} products is sold`);
  return res.json(`order success: ${+sale} products is sold`);
});
module.exports = router;
