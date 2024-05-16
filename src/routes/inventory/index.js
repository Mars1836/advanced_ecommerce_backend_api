const express = require("express");
const { verifyAsShop } = require("../../auth/authUtils");
const InventoryController = require("../../controllers/inventory.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
router.use(asyncHandler(verifyAsShop));
router.post("/add-stock", asyncHandler(InventoryController.addStock)); //shop
module.exports = router;
