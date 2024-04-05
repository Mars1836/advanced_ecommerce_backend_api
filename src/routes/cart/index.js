const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const CartController = require("../../controllers/cart.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
//authentication as user
router.post("", asyncHandler(CartController.create));
router.get("/:userId", asyncHandler(CartController.getCartInfor));
router.post("/add-prod", asyncHandler(CartController.addProduct));
router.post("/update", asyncHandler(CartController.updateQuantityProduct));
router.delete(
  "/:userId/:productId",
  asyncHandler(CartController.removeProduct)
);
module.exports = router;
