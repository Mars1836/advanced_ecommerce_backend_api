const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const EmailController = require("../../controllers/email.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
// router.use(authenticationV2);
router.post("/sendOTP", asyncHandler(EmailController.sendOTP)); //shop
module.exports = router;
