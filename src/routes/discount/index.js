const express = require("express");
const { verifyAsShop } = require("../../auth/authUtils");
const DiscountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();

router.get("/shop/:shopId", asyncHandler(DiscountController.findAllByShop));
router.post(
  "/shop",
  asyncHandler(verifyAsShop),
  asyncHandler(DiscountController.createShopDiscount)
);

module.exports = router;
