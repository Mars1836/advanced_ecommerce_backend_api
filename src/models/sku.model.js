const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const COLLECTION_NAME = "SKUs";
const DOCUMENT_NAME = "sku";

var skuSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    tier_idx: { type: Array, default: [0] }, // [0,1] , [1,1]  = red - size S , blue - size S
    default: { type: Boolean, default: false },
    slug: { type: String, default: "" },
    sort: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    spu_id: { type: String, required: true }, // ref to spu product
    isDraft: { type: Boolean, default: true, index: true, select: true },
    isPublished: { type: Boolean, default: true, index: true, select: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, skuSchema);
