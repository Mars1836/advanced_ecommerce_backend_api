const { BadRequestError, ErrorResponse } = require("../core/error.response");
const resourceModel = require("../models/resource.model");
const roleModel = require("../models/role.model");
const { flatToListGrant } = require("../utils");

class RBACService {
  static async createResource({ name, slug, description }) {
    try {
      const resource = await resourceModel.create({ name, slug, description });
      return resource;
    } catch (error) {
      throw new BadRequestError("Something wrong");
    }
  }
  static async getResource() {
    const resources = await resourceModel.aggregate([
      {
        $project: {
          _id: 0,
          name1: "$name",
          slug1: "$slug",
          description1: "description",
          resourceId: "_id",
          createAt: 1,
        },
      },
    ]);
    return resources;
  }
  static async createRole({
    name, //shop,
    slug, //s0001,
    description,
    grants = [],
    status,
  }) {
    const role = await roleModel.create({
      name,
      slug,
      description,
      grants,
      status,
    });
    return role;
  }
  static async getListRole() {
    const roles = await roleModel.find().lean();
    return flatToListGrant(roles);
  }
  static async addOrUpdateGrant({
    roleName,
    resourceName,
    actions = [],
    attributes = "*",
  }) {
    const role = await roleModel.findOne({ name: roleName });
    if (!role) {
      throw new ErrorResponse("This role doesn't exist");
    }
    const resource = await resourceModel.findOne({ name: resourceName });
    if (!resource) {
      throw new ErrorResponse("This resource doesn't exist");
    }
    const grantIndex = role.grants.findIndex((item) => {
      return item.recourse === resourceName;
    });
    if (grantIndex === -1) {
      role.grants.push({
        recourse: resource.name,
        actions,
        attributes,
      });
    }
    role.grants[grantIndex] = {
      recourse: resource.name,
      actions,
      attributes,
    };

    return await role.save();
  }
}
module.exports = RBACService;
