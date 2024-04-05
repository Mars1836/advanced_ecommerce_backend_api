const { BadRequestError } = require("../core/error.response");
const resourceModel = require("../models/resource.model");
const roleModel = require("../models/role.model");

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
  static async getRole({}) {}
}
module.exports = RBACService;
