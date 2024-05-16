const {
  SuccessResponse,
  CreateRequestSuccess,
} = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  static async addProductV2(req, res, next) {
    //USER
    const metadata = await CartService.addProductV2(
      { userId: req.user.ob.id },
      req.body
    );
    new SuccessResponse({
      message: "Add new product to cart success",
      metadata,
    }).send(res);
  }
  static async getCartInfor(req, res, next) {
    //USER
    const metadata = await CartService.getCartInfor({
      userId: req.user.ob.id,
    });
    new CreateRequestSuccess({
      message: "Get user's cart success",
      metadata,
    }).send(res);
  }
  static async create(req, res, next) {
    //USER
    const { userId } = req.body;
    const metadata = await CartService.create({ userId });
    new CreateRequestSuccess({
      message: "Create cart for user success",
      metadata,
    }).send(res);
  }
  static async addProduct(req, res, next) {
    const { spuId, skuId, quantity } = req.body;
    //USER
    const metadata = await CartService.addProductV2(
      { userId: req.user.ob.id },
      { spuId, skuId, quantity }
    );
    new SuccessResponse({
      message: "Add new product to cart success",
      metadata,
    }).send(res);
  }
  static async updateQuantityProduct(req, res, next) {
    //USER
    const { shopOrderIds, userId } = req.body;
    const metadata = await CartService.setProduct(
      { userId: req.user.ob.id },
      { shopOrderIds }
    );
    new SuccessResponse({
      message: "Update quantity product in cart success",
      metadata,
    }).send(res);
  }
  static async putOutProduct(req, res, next) {
    // USER

    const metadata = await CartService.putOutProduct(
      { userId: req.user.ob.id },
      req.body
    );
    new SuccessResponse({
      message: "Remove product in cart success",
      metadata,
    }).send(res);
  }
}
module.exports = CartController;
