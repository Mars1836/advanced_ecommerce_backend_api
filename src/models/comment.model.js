const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Comments";
const DOCUMENT_NAME = "comment";
// Declare the Schema of the Mongo model
var commentModel = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    left: {
      type: Number,
      default: 0,
    },
    right: {
      type: Number,
      default: 0,
    },
    isDedeted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, commentModel);
