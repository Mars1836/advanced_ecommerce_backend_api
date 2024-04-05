const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const DiscountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();

router.get("/:shopId", asyncHandler(DiscountController.findAllByShop));
router.use(authenticationV2);
router.post("", asyncHandler(DiscountController.create));

module.exports = router;
