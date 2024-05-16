const { SuccessResponse } = require("../core/success.response");
const RBACService = require("../services/rbac.service");

class RBACController {
  static async get(req, res, next) {
    const metadata = await RBACService.getResource();
    new SuccessResponse({
      message: "Get resource success",
      metadata: metadata,
    }).send(res);
  }
  static async createResource(req, res, next) {
    const { description, name, slug } = req.body;
    const metadata = await RBACService.createResource({
      description,
      name,
      slug,
    });
    new SuccessResponse({
      message: "Create resource success",
      metadata: metadata,
    }).send(res);
  }
  static async createRole(req, res, next) {
    const {
      name, //shop,
      slug, //s0001,
      description,
      grants,
      status,
    } = req.body;
    const metadata = await RBACService.createRole({
      name,
      slug,
      description,
      grants,
      status,
    });
    new SuccessResponse({
      message: "Create role success",
      metadata,
    }).send(res);
  }
  static async getListRole(req, res, next) {
    const metadata = await RBACService.getListRole();
    new SuccessResponse({
      message: "Get role success",
      metadata,
    }).send(res);
  }
  static async addOrUpdateGrant(req, res, next) {
    const { roleName, attributes, resourceName, actions } = req.body;
    const metadata = await RBACService.addOrUpdateGrant({
      roleName,
      attributes,
      resourceName,
      actions,
    });

    new SuccessResponse({
      message: "Add grant to role success",
      metadata: metadata,
    }).send(res);
  }
}
module.exports = RBACController;
