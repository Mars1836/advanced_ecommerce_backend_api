const express = require("express");
const { verifyAsUser, verifyAsShop } = require("../../auth/authUtils");
const OrderController = require("../../controllers/order.controller");

const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
router.post(
  "/",
  asyncHandler(verifyAsUser),
  asyncHandler(OrderController.orderByUser)
);
router.patch(
  "/status",
  asyncHandler(verifyAsShop),
  asyncHandler(OrderController.updateStatus)
);
router.get(
  "/",
  asyncHandler(verifyAsUser),
  asyncHandler(OrderController.getOrdersByUser)
);

module.exports = router;
