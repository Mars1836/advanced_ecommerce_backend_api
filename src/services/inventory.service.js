const { BadRequestError } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const productModel = require("../models/product.model");
const ProductService = require("./product.service");

class InventoryService {
  static async create({ stock, spuId, skuId, shopId, location }) {
    const productIdOb = await ProductService.checkSPUSKU({ spuId, skuId });

    const inventory = await inventoryModel.create({
      ...productIdOb,
      stock,
      shopId,
      location,
    });
    return inventory;
  }
  static async createMany(inventorys) {
    inventorys = await Promise.all(
      inventorys.map(async ({ stock, spuId, skuId, shopId, location }) => {
        const productIdOb = await ProductService.checkSPUSKU({ spuId, skuId });
        return {
          ...productIdOb,
          stock,
          shopId,
          location,
        };
      })
    );
    console.log("Inventoryyyyyyyyyyy: ", inventorys);
    return await inventoryModel.create(inventorys);
  }
  static async addStock({ stock, spuId, skuId, shopId }) {
    const productIdOb = await ProductService.checkSPUSKU({ spuId, skuId });

    const query = {
      ...productIdOb,
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
  static async addReservation({ spuId, skuId, shopId, quantity }) {
    const productIdOb = ProductService.checkSPUSKU({ spuId, skuId });
    const query = {
      ...productIdOb,
      shopId: shopId,
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
          ...productIdOb,
        },
      },
    };
    const options = { new: true };
    const mtd = await inventoryModel.findOneAndUpdate(query, update, options);
    return mtd;
  }
  static test() {}
}

module.exports = InventoryService;
