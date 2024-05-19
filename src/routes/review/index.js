const express = require("express");

const ReviewController = require("../../controllers/review.controller");

const asyncHandler = require("../../helpers/async.handler");
const { verifyAsUser, verifyAsShop } = require("../../auth/authUtils");
const router = express.Router();

router.post(
  "",
  asyncHandler(verifyAsUser),
  asyncHandler(ReviewController.create)
); //user,shop
router.post(
  "/reply",
  asyncHandler(verifyAsShop),
  asyncHandler(ReviewController.replyByShop)
); //user,shop
router.get("", asyncHandler(ReviewController.getBySPU)); //user,shop

module.exports = router;
// asyncHandler(UploadController.cloudinaryUploadByUrl))
