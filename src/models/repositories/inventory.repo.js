const inventoryModel = require("../inventory.model");

class InventoryRepo {
  static async create({ productId, shopId, stock, location }) {
    return await inventoryModel.create({ productId, shopId, stock, location });
  }
  static async reservation({ productId, quantity, cartId, userId }) {
    const query = {
      productId,
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
          cartId,
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
