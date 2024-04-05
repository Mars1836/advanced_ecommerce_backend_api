const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const { diskUpload, memoryUpload } = require("../../configs/multer.config");

const UploadController = require("../../controllers/upload.controller");

const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();

router.post(
  "/cloudinary/image-url",
  asyncHandler(UploadController.cloudinaryUploadByUrl)
); //user,shop
router.post(
  "/cloudinary/image-local",
  diskUpload.single("file"),
  asyncHandler(UploadController.cloudinaryUploadByLocalPath)
); //user,shop

router.post(
  "/s3/image-local",
  memoryUpload.single("file"),
  asyncHandler(UploadController.s3UploadByLocalPath)
); //user,shop

module.exports = router;
// asyncHandler(UploadController.cloudinaryUploadByUrl))
