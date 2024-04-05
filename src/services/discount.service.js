const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const productModel = require("../models/product.model");
const DiscountRepo = require("../models/repositories/discount.repo");
const ProductRepo = require("../models/repositories/product.repo");
const { arrayContain, countFrequencyEle } = require("../utils");
const ProductService = require("./product.service");

class DiscountService {
  // generator discount [Shop|Admin]
  static async create({
    name,
    description,
    type,
    value,
    code,
    startDate,
    endDate,
    maxUses,
    maxUsesPerPerson,
    minOrderValue,
    shopId,
    isActive,
    applyTo,
    productIds,
  }) {
    // check date
    if (
      new Date(startDate) >= new Date(endDate) ||
      new Date(endDate) <= new Date()
    ) {
      throw new BadRequestError("Invalid start date and end date");
    }
    //check exist
    const discountExist = await discountModel.findOne({ code, shopId });
    if (discountExist) {
      throw new BadRequestError("This voucher already exist!");
    }
    //check product in shop
    if (productIds?.length > 0) {
      for (const productId of productIds) {
        const checkProduct = await productModel.findOne({
          shopId,
          _id: productId,
        });
        if (!checkProduct) {
          throw new NotFoundError("Product does not exist in shop");
        }
      }
    }
    const discount = await discountModel.create({
      name,
      description,
      type,
      value,
      code,
      startDate,
      endDate,
      maxUses,
      maxUsesPerPerson,
      minOrderValue,
      shopId,
      isActive,
      applyTo,
      productIds: applyTo === "all" ? [] : productIds,
    });
    return discount;
  }
  // get all product apply to discount by discount  [user]
  static async getAllProductApplyToByDiscount(
    { code, shopId },
    { page, sort, skip, limit, select, unSelect }
  ) {
    const discount = await discountModel.findOne({ shopId, code }).lean();
    const options = { page, sort, skip, limit, select, unSelect };
    if (!discount) {
      throw new BadRequestError("This discount is not exist");
    }
    switch (discount.applyTo) {
      case "all":
        return await ProductRepo.findAllByQuery(
          {
            shopId,
            isPublish: true,
          },
          options
        );
      case "specific":
        return await ProductRepo.findAllByQuery({
          _id: {
            $in: discount.productIds,
          },
          shopId,
          isPublish: true,
        });
      default:
        throw new BadRequestError("This discount is not valid");
    }
  }
  //get all discount of a shop [shop,user]
  static async getAllDiscountByShop(
    { shopId },
    { page, sort, skip, limit, select, unSelect } = {}
  ) {
    const discounts = await DiscountRepo.findAllByQuery(
      {
        shopId,
        isActive: true,
      },
      {
        unSelect: ["__v", "shopId"],
      }
    );
    return discounts;
  }
  static async getDiscountAmount({ shopId, products = [], code, userId }) {
    const totalOrderPrice = products.reduce((pre, cur) => {
      return pre + cur.price * cur.quantity;
    }, 0);
    const discount = await discountModel.findOne({ code: code, shopId }).lean();
    if (!discount) {
      throw new NotFoundError("Discount doesn't exist");
    }
    this.checkOutDate(discount);
    this.checkValidForProducts(discount, products);
    this.checkValidPriceOrder(discount, totalOrderPrice);
    this.checkAmountDiscountUsePerUser(discount, userId);
    let amount = 0;
    switch (discount.type) {
      case "fixed_amount":
        amount = discount.value;
        break;
      case "percentage":
        amount = (totalOrderPrice * discount.value) / 100;
        break;
      default:
        throw new BadRequestError("This discount is not valid");
    }
    const newTotalOrderPrice =
      totalOrderPrice - amount >= 0 ? totalOrderPrice - amount : 0;

    return {
      totalOrderPrice,
      discount: amount,
      newTotalOrderPrice: newTotalOrderPrice,
    };
  }
  //delete discount [shop]
  static async delete({ shopId, code }) {
    const query = { shopId, code };
    return await discountModel.findOneAndDelete(query);
  }
  //cancel discount [user] //coding......................................................................
  static async cancel({ shopId, code, userId }) {
    const discount = await discountModel.findOne({ shopId, code });
    if (!discount) {
      throw new NotFoundError("This discoun doesn't exits");
    }
    return await discountModel.findByIdAndUpdate(discount._id, {
      $pull: {}, // solution for pull only one userId founded in array
      //coding......................................................................
      //coding......................................................................
      //coding......................................................................
      //coding......................................................................
      //coding......................................................................
    });
  }
  // DELETE DISCOUNT
  static async deleteByCode(code, options) {
    const deletedProduct = await discountModel.findOneAndDelete({ code });
    return deletedProduct;
  }

  // check discount valid
  static checkOutDate(discount) {
    if (new Date() > new Date(discount.endDate)) {
      throw new BadRequestError("This discount already expired");
    }
    return;
  }
  static checkValidForProducts(discount, products = []) {
    if (discount.applyTo === "all") {
      return;
    }
    const productIds = products.map((item) => {
      return item._id;
    });
    const strProductIds = productIds.map((item) => {
      return item.toString();
    });
    const strDiscountProductIds = discount.productIds.map((item) => {
      return item.toString();
    });
    if (!arrayContain(strProductIds, strDiscountProductIds)) {
      throw new BadRequestError(
        "This discount code is not valid for some added products"
      );
    }
    return;
  }
  static checkValidPriceOrder(discount, priceOrder) {
    if (discount.minOrderValue > priceOrder) {
      throw new BadRequestError(
        "Your order price is below the minimum price to apply this discount"
      );
    }
  }
  static checkAmountDiscountUsePerUser(discount, userId) {
    if (discount.maxUsesPerPerson === -1) {
      // -1 means not limiting the times that user use this discount
      return;
    }
    if (discount.maxUsesPerPerson > 0) {
      const fre = countFrequencyEle(discount.usersUsed, userId);
      if (fre >= discount.maxUsesPerPerson) {
        throw new BadRequestError(
          "You have used up the number of times this discount ticket has been used"
        );
      }
    }
    return;
  }
}
module.exports = DiscountService;
