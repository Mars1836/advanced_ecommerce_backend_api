const {
  CreateRequestSuccess,
  SuccessResponse,
} = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  static async createShopDiscount(req, res, next) {
    // shop
    const discount = await DiscountService.createShopDiscount(
      { shopId: req.shop.ob.id },
      {
        ...req.body,
      }
    );
    new CreateRequestSuccess({
      message: "create discount success",
      metadata: discount,
    }).send(res);
  }
  static async findAllByShop(req, res, next) {
    //public
    const discounts = await DiscountService.getAllDiscountByShop({
      shopId: req.params.shopId,
    });
    new SuccessResponse({
      message: "Get discounts success",
      metadata: discounts,
    }).send(res);
  }
  static async deleteByCode(req, res, next) {
    const discounts = await DiscountService.deleteByCode(req.params.code);
  }
}
module.exports = DiscountController;
