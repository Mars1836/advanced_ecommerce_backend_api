const { ErrorResponse } = require("../core/error.response");
const skuModel = require("../models/sku.model");
const spuModel = require("../models/spu.model");
const { getUnSelectData, delUnValueField } = require("../utils");
const InventoryService = require("./inventory.service");
const SKUService = require("./sku.service");

class SPUService {
  static async search({ text }, { page = 1, sort = 0, limit = 1 }) {
    const spus = spuModel
      .find(
        {
          $text: { $search: text },
        },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return spus;
  }
  static async findWithSKU({ spu_id }) {
    const spu = await spuModel
      .findOne({ id: spu_id })
      .lean()
      .select(
        getUnSelectData([
          "__v",
          "createdAt",
          "isDeleted",
          "isDraft",
          "isPublished",
        ])
      );

    if (!spu) {
      throw new ErrorResponse("This spu doesn't exist");
    }
    const skus = await skuModel
      .find({ spu_id })
      .lean()
      .select(
        getUnSelectData([
          "__v",
          "createdAt",
          "isDeleted",
          "isDraft",
          "isPublished",
        ])
      );
    return { ...spu, skus };
  }
  static async create(
    { shopId },
    {
      name,
      thumb,
      description,
      price,
      catagories,
      attributes,
      variations,
      sku_list = [],
      stock,
      location,
    }
  ) {
    const spu = await spuModel.create({
      name,
      thumb,
      description,
      price,
      catagories,
      attributes,
      variations,
      shopId,
    });
    if (spu && sku_list.length > 0) {
      await SKUService.createBaseOnSPU({ spu_id: spu.id, sku_list, shopId });
      return spu;
    }
    const inventory = {
      spuId: spu.id,
      location,
      shopId,
      stock,
    };
    delUnValueField(inventory);
    await InventoryService.create(inventory);
    return spu;
  }
}
module.exports = SPUService;
