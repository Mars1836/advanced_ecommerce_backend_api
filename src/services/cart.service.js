const { default: mongoose } = require("mongoose");
const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const { handleIdToObjectId } = require("../utils");

class CartService {
  static async addQuantityProduct({ userId, productId }, { quantity }) {
    const query = {
      userId,
      "productIds._id": productId,
      state: "active",
    };
    const update = {
      $inc: {
        "productIds.$.quantity": quantity,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    const cart = await cartModel.findOneAndUpdate(query, update, options);
    return cart;
  }
  static async setQuantityProduct({ userId, productId }, { quantity }) {
    const query = {
      userId,
      "productIds._id": productId,
      state: "active",
    };
    const update = {
      $set: {
        "productIds.$.quantity": quantity,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    const q = await cartModel.findOne(query);
    if (!q) {
      throw new NotFoundError("Product has not been added to cart");
      // return await this.addProduct({ userId }, { productId, quantity });
    }
    return await cartModel.findOneAndUpdate(query, update, options);
  }
  //get infor cart of user

  static async getCartInfor({ userId }) {
    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      throw new NotFoundError("Can't found cart of this user");
    }
    return cart;
  }
  //create cart for users
  static async create({ state, userId }) {
    return await cartModel.create({ state, userId });
  }

  //
  static async addProduct({ userId }, { productId, quantity }) {
    const query = { userId };
    const cart = await cartModel.findOne(query);
    const product = await productModel.findById(productId).lean();
    if (!product) {
      throw new NotFoundError("Not found product");
    }
    product.quantity = quantity;
    product.productId = product._id;
    // Have no cart
    if (!cart) {
      const ncart = await CartService.create({ userId, state: "active" });

      ncart.productIds = [product];
      return await ncart.save();
    }

    const isProductExistInCart = await cartModel.findOne({
      userId,
      "productIds.productId": productId,
    });
    // Product is not in cart
    if (!isProductExistInCart) {
      cart.productIds.push(product);
      return await cart.save();
    }
    // Product was in cart and update quanity
    return await this.addQuantityProduct(
      { userId, productId: product._id },
      { quantity: product.quantity }
    );
  }

  static async updateQuantityProduct({ userId }, { shopOrderIds }) {
    const query = { userId };
    const { productId, newQuantity, oldQuantity } = shopOrderIds[0]?.product[0];
    const { shopId } = shopOrderIds[0];
    //check product exits
    const foundProduct = await productModel
      .findOne({ _id: productId, shopId })
      .lean();
    if (!foundProduct) {
      throw new NotFoundError("Not found product");
    }
    if (newQuantity === 0) {
      return await removeProduct({ productId, userId });
    }
    return await this.setQuantityProduct(
      { userId, productId: foundProduct._id },
      { quantity: newQuantity }
    );
  }

  static async updateQuantityProductV2({ userId }, { shopOrderIds }) {
    const query = { userId };
    const { productId, newQuantity } = shopOrderIds[0]?.product[0];
    const { shopId } = shopOrderIds[0];
    //check product exits
    const foundProduct = await productModel
      .findOne({ _id: productId, shopId })
      .lean();
    if (!foundProduct) {
      throw new NotFoundError("Not found product");
    }
    if (newQuantity === 0) {
      return await removeProduct({ productId, userId });
    }
    const cart = await cartModel.findOne({ userId });
    const productInCart = cart.productIds.find((item) => {
      return item._id.toString() === productId;
    });
    if (!productInCart) {
    }
    const res = await this.addQuantityProduct(
      { userId, productId: foundProduct._id },
      { quantity: newQuantity - oldQuantity }
    );
    return res;
  }
  static async removeProduct({ productId, userId }) {
    const query = { userId, state: "active" };
    const update = {
      $pull: {
        productIds: { productId: productId },
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    return await cartModel.findOneAndUpdate(query, update, options);
  }
}
module.exports = CartService;
