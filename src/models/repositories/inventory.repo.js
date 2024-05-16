const inventoryModel = require("../inventory.model");

class InventoryRepo {
  static async create({ productId, shopId, stock, location }) {
    return await inventoryModel.create({ productId, shopId, stock, location });
  }
  static async reservation({ productIdOb, quantity, cartId, userId }) {
    const query = {
      ...productIdOb,
      stock: {
        $gte: quantity,
      },
    };
    const update = {
      $inc: {
        stock: -quantity,
      },
      $push: {
        reservations: {
          userId,
          quantity,
          createAt: new Date(),
        },
      },
    };
    const options = { new: true };
    const mtd = await inventoryModel.findOneAndUpdate(query, update, options);
    return mtd;
  }
}
module.exports = InventoryRepo;
