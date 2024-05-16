"use strict";

const {
  CreateRequestSuccess,
  SuccessResponse,
} = require("../core/success.response");
const productModel = require("../models/product.model");

const ProductService = require("../services/product.service");
const SKUService = require("../services/sku.service");
const SPUService = require("../services/spu.service");
const { getRoleByUserId } = require("../services/user.service");
class ProductController {
  //delete
  delete = async (req, res, next) => {
    //shop
    const infor = await ProductService.delete({
      ...req.body,
      shopId: req.shop.ob.id,
    });
    new SuccessResponse({
      message: "Delete product success!",
      metadata: infor,
    }).send(res);
  };
  // create
  create = async (req, res, next) => {
    //shop
    const infor = await ProductService.create({
      ...req.body,
      shopId: req.shop.ob.id,
    });
    new CreateRequestSuccess({
      message: "Create product success!",
      metadata: infor,
    }).send(res);
  };
  createMany = async (req, res, next) => {
    // codinggggggggggg
    //shop
    const infor = await ProductService.createMany({
      payload: req.body,
      shopId: req.shop.ob.id,
    });
    new CreateRequestSuccess({
      message: "Create product success!",
      metadata: infor,
    }).send(res);
  };
  //Query//
  /**
   * @desc Get all Drafts for shop
   * @param
   */
  findAll = async (req, res, next) => {
    //shop
    const metadata = await ProductService.findAll(req.query);
    new SuccessResponse({ message: "Get all product success!", metadata }).send(
      res
    );
  };
  searchByUser = async (req, res, next) => {
    // public
    const { sort, page } = req.query;
    const metadata = await ProductService.searchByUser(
      {
        keySearch: req.params.keySearch,
      },
      { sort, page }
    );
    new SuccessResponse({ message: "Search product success", metadata }).send(
      res
    );
  };
  findAllByShop = async (req, res, next) => {
    //public
    const { sort, limit, page } = req.query;
    const metadata = await ProductService.findAllByShop(
      {
        shopId: req.params.shopId,
      },
      { sort, limit, page }
    );
    new SuccessResponse({ message: "Get all product success", metadata }).send(
      res
    );
  };
  findAllDraftOfShop = async (req, res, next) => {
    //shop
    const options = req.query;
    const metadata = await ProductService.findAllDraftsOfShop(
      {
        shopId: req.shop.ob.id,
      },
      options
    );
    new SuccessResponse({ message: "get list draft success", metadata }).send(
      res
    );
  };
  findAllPublishOfShop = async (req, res, next) => {
    const { shopId } = req.params;

    //public
    const metadata = await ProductService.findAllPublishOfShop(
      {
        shopId,
      },
      req.query
    );
    new SuccessResponse({ message: "Get list publish success", metadata }).send(
      res
    );
  };
  findById = async (req, res, next) => {
    const metadata = await ProductService.findById(
      {
        id: req.params.id,
      },
      req.query
    );
    new SuccessResponse({ message: "Get product success", metadata }).send(res);
  };

  // update

  updateById = async (req, res, next) => {
    console.log(req.shop);
    const metadata = await ProductService.updateById(
      { id: req.params.id, shopId: req.shop.ob.id },
      req.body
    );
    new SuccessResponse({ message: "Update product success", metadata }).send(
      res
    );
  };
  publishProductByShop = async (req, res, next) => {
    const metadata = await ProductService.publishProductByShop({
      shopId: req.shop.ob.id,
      id: req.params.id,
    });
    new SuccessResponse({ message: "Publish success product", metadata }).send(
      res
    );
  };
  unPublishProductByShop = async (req, res, next) => {
    const metadata = await ProductService.unPublishProductByShop({
      shopId: req.shop.ob.id,
      id: req.params.id,
    });
    new SuccessResponse({
      message: "Unpublish success product",
      metadata,
    }).send(res);
  };
  //SPU,SKU//
  createSPU = async (req, res, next) => {
    const metadata = await SPUService.create(
      { shopId: req.shop.ob.id },
      req.body
    );
    new SuccessResponse({ message: "Create spu success", metadata }).send(res);
  };
  findSPUWithSKU = async (req, res, next) => {
    const { spu_id } = req.query;
    const metadata = await SPUService.findWithSKU({
      spu_id,
    });
    new SuccessResponse({ message: "Create spu success", metadata }).send(res);
  };
  searchSPU = async (req, res, next) => {
    const { text } = req.params;
    const options = req.query;
    console.log("text: _________", text);
    const metadata = await SPUService.search(
      {
        text,
      },
      options
    );
    new SuccessResponse({ message: "Create spu success", metadata }).send(res);
  };
  fineSKUById = async (req, res, next) => {
    const { sku_id, spu_id } = req.query;

    const metadata = await SKUService.findById({
      sku_id,
      spu_id,
    });
    new SuccessResponse({ message: "Create spu success", metadata }).send(res);
  };
}
module.exports = new ProductController();
