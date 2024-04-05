const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const NotificationController = require("../../controllers/notification.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
//authentication as user
router.get("", asyncHandler(NotificationController.getByUser));

module.exports = router;
