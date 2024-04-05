const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const CommentController = require("../../controllers/comment.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
//authentication as user
router.post("", asyncHandler(CommentController.create));
router.get("", asyncHandler(CommentController.getByProduct));
router.delete("", asyncHandler(CommentController.delete));

module.exports = router;
