// add comment [user,shop]
// get comments [user,shop]

const { NotBeforeError } = require("jsonwebtoken");
const { BadRequestError } = require("../core/error.response");
const Payload = require("../helpers/payload.handler");
const commentModel = require("../models/comment.model");

// delete comment [user,shop,admin]

class CommentService {
  //get comment
  static async findByProduct({ productId, parentId }, options) {
    if (!parentId) {
      parentId = null;
      const comments = await commentModel.find({ productId, parentId });
      return comments;
    }
    const parentComment = await commentModel
      .findOne({ productId, _id: parentId })
      .lean();
    if (!parentComment) {
      throw new BadRequestError("This comment not founded");
    }
    const comments = await commentModel.find({
      productId,
      right: {
        $lt: parentComment.right,
      },
      left: { $gt: parentComment.left },
    });
    return comments;
  }

  // Delete comment
  static async delete({ productId, id }) {
    const comment = await commentModel.findOne({ productId, _id: id }).lean();
    if (!comment) {
      throw new BadRequestError("This comment not founded");
    }
    const width = comment.right - comment.left + 1;
    await commentModel.deleteMany({
      productId,
      left: {
        $gte: comment.left,
      },
      right: {
        $lte: comment.right,
      },
    });
    await commentModel.updateMany(
      {
        productId,
        right: {
          $gt: comment.right,
        },
      },
      {
        $inc: {
          right: -width,
        },
      }
    );
    await commentModel.updateMany(
      {
        productId,
        left: {
          $gt: comment.right,
        },
      },
      {
        $inc: {
          left: -width,
        },
      }
    );
  }
  //Create comment
  static async create({ content, userId, productId, parentId }) {
    if (!parentId) {
      const comment = await commentModel.findOne(
        {
          productId,
        },
        "right",
        { sort: { right: -1 } }
      );
      const right = comment?.right || 0;
      return await commentModel.create({
        content,
        userId,
        productId,
        parentId,
        left: right + 1,
        right: right + 2,
      });
    } else {
      const comment = await commentModel.findOne(
        {
          productId,
          _id: parentId,
        },
        "right",
        { sort: { right: -1 } }
      );
      if (!comment) {
        throw new NotBeforeError("Not found this comment");
      }
      const right = comment?.right || 0;
      await commentModel.updateMany(
        {
          productId,
          right: {
            $gte: right,
          },
        },
        {
          $inc: {
            right: 2,
          },
        }
      );
      await commentModel.updateMany(
        {
          productId,
          left: {
            $gte: right,
          },
        },
        {
          $inc: {
            left: 2,
          },
        }
      );
      return await commentModel.create({
        content,
        userId,
        productId,
        parentId,
        left: right,
        right: right + 1,
      });
    }
  }
}
module.exports = CommentService;
