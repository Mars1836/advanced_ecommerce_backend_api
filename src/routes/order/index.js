const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const OrderController = require("../../controllers/order.controller");

const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
router.post("/", asyncHandler(OrderController.orderByUser));

module.exports = router;
