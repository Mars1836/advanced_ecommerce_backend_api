const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const EmailController = require("../../controllers/email.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
// router.use(authenticationV2);
router.post(
  "/send-verify-email",
  asyncHandler(EmailController.sendVerifyEmail)
); //shop
module.exports = router;
