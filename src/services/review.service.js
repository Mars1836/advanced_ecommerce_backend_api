const { ErrorResponse, BadRequestError } = require("../core/error.response");
const orderModel = require("../models/order.model");
const reviewModel = require("../models/review.model");
const userModel = require("../models/user.model");

class ReviewService {
  static async create({ userId }, { content, images, star, orderId, spuId }) {
    const user = await userModel.findOne({ _id: userId, status: "active" });
    if (!user) {
      throw new ErrorResponse("User does not exist!");
    }

    const storedReview = await reviewModel.findOne({ orderId, spuId });
    if (storedReview) {
      throw new BadRequestError("You can only review once after buying it.");
    }
    console.log("storedReview: ", storedReview);
    // product must in a delivered order
    const order = await orderModel.findOne({
      _id: orderId,
      status: "delivered",
    });
    if (!order) {
      throw new BadRequestError(
        "You must have this product in your order before performing this action."
      );
    }
    const index = order?.products.findIndex((item) => {
      return item.spuId === spuId;
    });
    if (index === -1) {
      throw new BadRequestError(
        "You must have this product in your order before performing this action."
      );
    }
    const review = await reviewModel.create({
      content,
      images,
      star,
      userId,
      spuId,
      orderId,
      shopId: order.shopId,
    });
    return review;
  }
  static async getBySPU({ spuId }) {
    const reviews = await reviewModel.find({ spuId });
    return reviews;
  }
  static async replyByShop({ shopId }, { content, reviewId }) {
    const review = await reviewModel.findOne({
      shopId,
      _id: reviewId,
    });
    if (!review) {
      throw new BadRequestError(
        "Can not find the review provided in your store."
      );
    }
    review?.reply.push({ content });
    return review.save();
  }
}
module.exports = ReviewService;
