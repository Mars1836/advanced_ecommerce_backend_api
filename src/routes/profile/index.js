const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const ProfileController = require("../../controllers/profile.controller");
const asyncHandler = require("../../helpers/async.handler");
const grantAccess = require("../../middlewares/role.middleware");
const router = express.Router();
router.get(
  "/viewAny",
  grantAccess("readAny", "profile"),
  asyncHandler(ProfileController.profiles)
);
router.get(
  "/viewOwn",
  grantAccess("readOwn,profile"),
  asyncHandler(ProfileController.profile)
);
module.exports = router;
