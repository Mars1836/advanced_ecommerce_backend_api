const {
  CreateRequestSuccess,
  SuccessResponse,
} = require("../core/success.response");
const InventoryService = require("../services/inventory.service");
class InventoryController {
  static async addStock(req, res, next) {
    // shop
    const { stock, shopId, productId } = req.body;

    const discount = await InventoryService.addStock({
      stock,
      shopId,
      productId,
    });
    new CreateRequestSuccess({
      message: "create discount success",
      metadata: discount,
    }).send(res);
  }
}
module.exports = InventoryController;
