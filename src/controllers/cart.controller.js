const {
  SuccessResponse,
  CreateRequestSuccess,
} = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  static async getCartInfor(req, res, next) {
    //USER
    const { userId } = req.params;
    const metadata = await CartService.getCartInfor({
      userId,
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
    const { userId, productId, quantity } = req.body;
    //USER
    const metadata = await CartService.addProduct(
      { userId },
      { productId, quantity }
    );
    new SuccessResponse({
      message: "Add new product to cart success",
      metadata,
    }).send(res);
  }
  static async updateQuantityProduct(req, res, next) {
    //USER
    const { shopOrderIds, userId } = req.body;
    const metadata = await CartService.updateQuantityProduct(
      { userId },
      { shopOrderIds }
    );
    new SuccessResponse({
      message: "Update quantity product in cart success",
      metadata,
    }).send(res);
  }
  static async removeProduct(req, res, next) {
    // USER
    const { productId, userId } = req.params;
    const metadata = await CartService.removeProduct({ productId, userId });
    new SuccessResponse({
      message: "Remove product in cart success",
      metadata,
    }).send(res);
  }
}
module.exports = CartController;
