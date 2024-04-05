const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const CheckoutController = require("../../controllers/checkout.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
//authentication as user
router.post("/review", asyncHandler(CheckoutController.checkout));

module.exports = router;
