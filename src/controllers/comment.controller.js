const {
  SuccessResponse,
  CreateRequestSuccess,
} = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");
const CommentService = require("../services/comment.service");

class CommentController {
  static async addCommentByUser(req, res, next) {
    const metadata = await CommentService.addCommentByUser({
      ...req.body,
      userId: req.user.ob.id,
    });
    new CreateRequestSuccess({ message: "Created new comment", metadata }).send(
      res
    );
  }
  static async addCommentByShop(req, res, next) {
    const metadata = await CommentService.addCommentByShop({
      ...req.body,
      userId: req.shop.ob.id,
    });
    new CreateRequestSuccess({ message: "Created new comment", metadata }).send(
      res
    );
  }
  static async getByProduct(req, res, next) {
    const { productId, parentId } = req.query;
    const metadata = await CommentService.findByProduct({
      productId,
      parentId,
    });
    new SuccessResponse({ message: "Get comments success", metadata }).send(
      res
    );
  }

  static async delete(req, res, next) {
    const metadata = await CommentService.delete({ ...req.body });
    new SuccessResponse({ message: "Delete comments success", metadata }).send(
      res
    );
  }
  static async commentReview(req, res, next) {
    const metadata = await CommentService.review({ ...req.body });
    new SuccessResponse({ message: "Review comment", metadata }).send(res);
  }
}
module.exports = CommentController;
