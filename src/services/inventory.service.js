const { BadRequestError } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const productModel = require("../models/product.model");

class InventoryService {
  static async addStock({ stock, productId, shopId }) {
    const storedProduct = await productModel.findOne({
      _id: productId,
      shopId,
    });
    if (!storedProduct) {
      return new BadRequestError("This product does not existed");
    }
    const query = {
      productId,
      shopId,
    };
    const update = {
      $inc: {
        stock,
      },
    };
    const options = {
      new: true,
      upsert: true,
    };
    return await inventoryModel.findOneAndUpdate(query, update, options);
  }
  static test() {}
}
module.exports = InventoryService;
