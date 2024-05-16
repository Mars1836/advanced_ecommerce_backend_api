const express = require("express");
const { verifyAsUser } = require("../../auth/authUtils");
const OrderController = require("../../controllers/order.controller");

const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
router.post(
  "/",
  asyncHandler(verifyAsUser),
  asyncHandler(OrderController.orderByUser)
);

module.exports = router;
