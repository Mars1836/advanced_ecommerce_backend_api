const skuModel = require("../models/sku.model");
const { generateId, getUnSelectData, delUnValueField } = require("../utils");
const InventoryService = require("./inventory.service");

class SKUService {
  static async createBaseOnSPU({ spu_id, sku_list, shopId }) {
    const skusData = sku_list.map((sku) => {
      return {
        ...sku,
        spu_id,
        id: `${spu_id}.${generateId()}`,
      };
    });
    const skus = await skuModel.insertMany(skusData);
    const inventorys = skusData.map((sku, index) => {
      let ob = {
        stock: sku.stock,
        location: sku.location,
        shopId: shopId,
        skuId: skus[index]?.id,
        spuId: spu_id,
      };
      delUnValueField(ob);
      return ob;
    });
    console.log("Inventorys : ", inventorys);
    await InventoryService.createMany(inventorys);
    return skus;
  }
  static async findById({ spu_id, sku_id }) {
    const sku = await skuModel
      .findOne({ spu_id, id: sku_id })
      .select(
        getUnSelectData([
          "__v",
          "createdAt",
          "isDeleted",
          "isDraft",
          "isPublished",
        ])
      );
    return sku;
  }
}
module.exports = SKUService;
