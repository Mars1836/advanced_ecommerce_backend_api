const { Schema, default: mongoose } = require("mongoose");

// Định nghĩa schema cho phản hồi từ shop
const COLLECTION_NAME = "Reviews";
const DOCUMENT_NAME = "review";
const replySchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Reply_reviews",
  }
);

// Định nghĩa schema cho review
const reviewSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    spuId: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    star: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
      required: true,
    },
    reply: { type: [replySchema], default: [] }, // Trường cho phản hồi từ shop
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, reviewSchema);
