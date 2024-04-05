const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const InventoryController = require("../../controllers/inventory.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
router.use(authenticationV2);
router.post("/add-stock", asyncHandler(InventoryController.addStock)); //shop
module.exports = router;
