const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const KeyController = require("../../controllers/key.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
//authentication as user
router.post("", asyncHandler(KeyController.create));

module.exports = router;
