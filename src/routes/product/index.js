const express = require("express");
const { verifyAsShop } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/async.handler");
const router = express.Router();

//spu-sku
router.post(
  "/spu",
  asyncHandler(verifyAsShop),
  asyncHandler(productController.createSPU)
);
router.get("/spu/sku", asyncHandler(productController.findSPUWithSKU));
router.get("/spu/search", asyncHandler(productController.searchSPU));
router.get("/spu/suggest", asyncHandler(productController.findSuggestSPU));

router.get("/sku", asyncHandler(productController.fineSKUById));

//spu-sku_____
router.get(
  "/item/search/:keySearch",
  asyncHandler(productController.searchByUser)
); //user
router.get("/item/shop/:shopId", asyncHandler(productController.findAllByShop)); //user

router.get(
  //user
  "/item/publish/shop/:shopId",
  asyncHandler(productController.findAllPublishOfShop)
);

router.get("/item/:id", asyncHandler(productController.findById)); //user
router.get("/item", asyncHandler(productController.findAll)); //user

//post
router.post(
  "/item",
  asyncHandler(verifyAsShop),
  asyncHandler(productController.create)
); //shop
router.post(
  "/item/many",
  asyncHandler(verifyAsShop),
  asyncHandler(productController.createMany)
); //shop

//put

router.put(
  // shop
  "/item/publish/:id",
  asyncHandler(verifyAsShop),
  asyncHandler(productController.publishProductByShop)
);
router.put(
  //shop
  "/item/un-publish/:id",
  asyncHandler(verifyAsShop),
  asyncHandler(productController.unPublishProductByShop)
);
router.put(
  "/item/:id",
  asyncHandler(verifyAsShop),
  asyncHandler(productController.updateById)
); //shop
//get
router.get(
  "/item/draft/all",
  asyncHandler(verifyAsShop),
  asyncHandler(productController.findAllDraftOfShop)
); //shop

//delete
router.delete(
  "/item",
  asyncHandler(verifyAsShop),
  asyncHandler(productController.delete)
);

//
module.exports = router;
