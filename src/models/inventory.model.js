const mongoose = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");
const productTypeModel = require("./product.type.model");
const COLLECTION_NAME = "Inventories";
const DOCUMENT_NAME = "inventory";
// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema(
  {
    skuId: {
      type: String,
    },
    spuId: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      default: "unKnow",
    },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
    },
    reservations: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema);
