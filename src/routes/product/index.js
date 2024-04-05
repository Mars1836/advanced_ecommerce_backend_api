const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();

router.get("/search/:keySearch", asyncHandler(productController.searchByUser)); //user
router.get("/shop/:shopId", asyncHandler(productController.findAllByShop)); //user

router.get(
  //user
  "/publish/shop/:shopId",
  asyncHandler(productController.findAllPublishOfShop)
);
router.get("/:id", asyncHandler(productController.findById)); //user
router.get("/", asyncHandler(productController.findAll)); //user

// api require authentication
router.use(authenticationV2);

//post
router.post("", asyncHandler(productController.create)); //shop
router.post("/many", asyncHandler(productController.createMany)); //shop

//put

router.put(
  // shop
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
router.put(
  //shop
  "/un-publish/:id",
  asyncHandler(productController.unPublishProductByShop)
);
router.put("/:id", asyncHandler(productController.updateById)); //shop
//get
router.get("/draft/all", asyncHandler(productController.findAllDraftOfShop)); //shop

//delete
router.delete("", asyncHandler(productController.delete));
module.exports = router;
