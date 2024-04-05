const mongoose = require("mongoose"); // Erase if already required

const clothesSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
    },
  },
  {
    collection: "Clothes",
    timestamps: true,
  }
);
const electronicsSchema = new mongoose.Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
    },
  },
  {
    collection: "Electronics",
    timestamps: true,
  }
);
const furnitureSchema = new mongoose.Schema(
  {
    manufacturer: { type: String, required: true },
    color: String,
    material: String,
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
    },
  },
  { collection: "Furniture", timestamps: true }
);
const productTypeModel = {
  clothes: mongoose.model("clothes", clothesSchema),
  electronics: mongoose.model("electronics", electronicsSchema),
  furniture: mongoose.model("furniture", furnitureSchema),
};
module.exports = productTypeModel;
