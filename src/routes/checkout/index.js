const { verify } = require("crypto");
const express = require("express");
const { verifyAsUser } = require("../../auth/authUtils");
const CheckoutController = require("../../controllers/checkout.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
//authentication as user
router.post(
  "/review",
  asyncHandler(verifyAsUser),
  asyncHandler(CheckoutController.checkout)
);

module.exports = router;
