const express = require("express");
const { verifyAsShop, verifyAsUser } = require("../../auth/authUtils");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();

router.post("/shop/signup", asyncHandler(accessController.signUpByShop));
router.post("/shop/signin", asyncHandler(accessController.signInByShop));
router.post("/user/signup", asyncHandler(accessController.signUpByUser));
router.post("/user/signin", asyncHandler(accessController.signInByUser));
router.post(
  "/shop/logout",
  asyncHandler(verifyAsShop),
  asyncHandler(accessController.logoutByShop)
);
router.post(
  "/user/logout",
  asyncHandler(verifyAsUser),
  asyncHandler(accessController.logoutByUser)
);
router.post(
  "/shop/handle-refresh-token",
  asyncHandler(verifyAsShop),
  asyncHandler(accessController.handleAccessTokenV2)
);
router.post(
  "/user/handle-refresh-token",
  asyncHandler(verifyAsUser),
  asyncHandler(accessController.handleAccessTokenV2)
);
module.exports = router;
