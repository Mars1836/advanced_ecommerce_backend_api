const {
  CreateRequestSuccess,
  SuccessResponse,
} = require("../core/success.response");
const ReviewService = require("../services/review.service");

class ReviewController {
  static async create(req, res, next) {
    const metadata = await ReviewService.create(
      { userId: req.user.ob.id },
      req.body
    );
    new CreateRequestSuccess({
      metadata,
      message: "Create review success",
    }).send(res);
  }
  static async getBySPU(req, res, next) {
    const metadata = await ReviewService.getBySPU(req.query); //{spuId : ...}
    new SuccessResponse({ metadata, message: "Get reviews success" }).send(res);
  }
  static async replyByShop(req, res, next) {
    const metadata = await ReviewService.replyByShop(
      { shopId: req.shop.ob.id },
      req.body
    ); //{spuId : ...}
    new SuccessResponse({ metadata, message: "Get reviews success" }).send(res);
  }
}
module.exports = ReviewController;
