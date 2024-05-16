const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Discounts";
const DOCUMENT_NAME = "discount";
// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "fixed_amount",
      enum: ["fixed_amount", "percentage"],
    },
    value: {
      type: Number,
      require: true,
    },
    code: {
      type: String,
      require: true,
    },
    startDate: {
      type: Date,
      require: true,
    },
    endDate: {
      type: Date,
      require: true,
    },
    usersUsed: {
      type: Array,
      default: [],
    },
    maxUses: {
      type: Number,
      required: true,
    },
    maxUsesPerPerson: {
      type: Number,
      required: true,
    },
    minOrderValue: {
      type: Number,
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applyTo: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    spuIds: {
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
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
