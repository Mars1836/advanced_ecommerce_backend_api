const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const RBACController = require("../../controllers/rbac.controller");
const asyncHandler = require("../../helpers/async.handler");
const grantAccess = require("../../middlewares/role.middleware");
const router = express.Router();
router.patch("/role/grants", asyncHandler(RBACController.addOrUpdateGrant));
router.get("/role", asyncHandler(RBACController.getListRole));
router.post("/role", asyncHandler(RBACController.createRole));
router.get("/resource", asyncHandler(RBACController.getResource));
router.post("/resource", asyncHandler(RBACController.createResource));

module.exports = router;
