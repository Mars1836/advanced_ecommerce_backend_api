const express = require("express");
const { verifyAsUser } = require("../../auth/authUtils");
const CartController = require("../../controllers/cart.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
//authentication as user
router.post("", asyncHandler(CartController.create));
router.get(
  "",
  asyncHandler(verifyAsUser),
  asyncHandler(CartController.getCartInfor)
);
router.post(
  "/add-prod",
  asyncHandler(verifyAsUser),
  asyncHandler(CartController.addProduct)
);
router.post(
  "/update",
  asyncHandler(verifyAsUser),
  asyncHandler(CartController.updateQuantityProduct)
);
router.delete(
  "/put-out",
  asyncHandler(verifyAsUser),
  asyncHandler(CartController.putOutProduct)
);
module.exports = router;
