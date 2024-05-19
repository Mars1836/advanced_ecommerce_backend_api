const {
  SuccessResponse,
  CreateRequestSuccess,
} = require("../core/success.response");
const AttrService = require("../services/attribute.service");

class AttrController {
  static async create(req, res, next) {
    //Admin
    const metadata = await AttrService.create(req.body);
    new SuccessResponse({
      message: "Add new attribute",
      metadata,
    }).send(res);
  }
  static async createItem(req, res, next) {
    //Admin
    const metadata = await AttrService.createItem(req.body);
    new SuccessResponse({
      message: "Add new attribute item",
      metadata,
    }).send(res);
  }
  static async removeById(req, res, next) {
    //Admin
    const metadata = await AttrService.removeById(req.body);
    new SuccessResponse({
      message: "Remove an attribute success",
      metadata,
    }).send(res);
  }

  static async getAllDetailAttr(req, res, next) {
    //Admin
    const metadata = await AttrService.getAllDetailAttr(req.query);
    new SuccessResponse({
      message: "Get all detail attribute",
      metadata,
    }).send(res);
  }
  static async updateOne(req, res, next) {
    //Admin
    const metadata = await AttrService.updateOne(req.body);
    new SuccessResponse({
      message: "Update an attribute success",
      metadata,
    }).send(res);
  }
}
module.exports = AttrController;
