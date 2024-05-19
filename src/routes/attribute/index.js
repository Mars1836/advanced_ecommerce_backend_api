const express = require("express");
const { verifyAsUser } = require("../../auth/authUtils");
const { permission } = require("../../auth/checkAuthMid");
const AttrController = require("../../controllers/attribute.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();
//authentication as admin
router.get("", asyncHandler(AttrController.getAllDetailAttr));
router.use(permission("1111"));
router.post("", asyncHandler(AttrController.create));
router.post("/item", asyncHandler(AttrController.createItem));

router.delete("/:id", asyncHandler(AttrController.removeById));
router.patch("/:id", asyncHandler(AttrController.updateOne));

module.exports = router;
