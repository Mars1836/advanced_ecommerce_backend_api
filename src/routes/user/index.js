const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const UserController = require("../../controllers/user.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
router.post(
  "/email/register",
  asyncHandler(UserController.createWithVerifyEmail)
);
router.get(
  "/verify/register",
  asyncHandler(UserController.checkVerifyEmailForCreate)
);
router.post("", asyncHandler(UserController.register));

module.exports = router;
