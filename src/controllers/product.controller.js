"use strict";

const {
  CreateRequestSuccess,
  SuccessResponse,
} = require("../core/success.response");
const productModel = require("../models/product.model");

const ProductService = require("../services/product.service");
class ProductController {
  //delete
  delete = async (req, res, next) => {
    //shop
    const infor = await ProductService.delete({
      ...req.body,
      shopId: req.user.userId,
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
      shopId: req.user.userId,
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
      shopId: req.user.userId,
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
    console.log(req.params.keySearch);
    const metadata = await ProductService.searchByUser({
      keySearch: req.params.keySearch,
    });
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
        shopId: req.user.userId,
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
    const metadata = await ProductService.updateById(
      { id: req.params.id, shopId: req.user.userId },
      req.body
    );
    new SuccessResponse({ message: "Update product success", metadata }).send(
      res
    );
  };
  publishProductByShop = async (req, res, next) => {
    const metadata = await ProductService.publishProductByShop({
      shopId: req.user.userId,
      id: req.params.id,
    });
    new SuccessResponse({ message: "Publish success product", metadata }).send(
      res
    );
  };
  unPublishProductByShop = async (req, res, next) => {
    const metadata = await ProductService.unPublishProductByShop({
      shopId: req.user.userId,
      id: req.params.id,
    });
    new SuccessResponse({
      message: "Unpublish success product",
      metadata,
    }).send(res);
  };
}
module.exports = new ProductController();
