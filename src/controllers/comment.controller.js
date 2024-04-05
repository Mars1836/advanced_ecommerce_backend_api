const {
  SuccessResponse,
  CreateRequestSuccess,
} = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");
const CommentService = require("../services/comment.service");

class CommentController {
  static async create(req, res, next) {
    const metadata = await CommentService.create(req.body);
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
}
module.exports = CommentController;
