const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Orders";
const DOCUMENT_NAME = "order";
// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    shiping: {
      type: {
        city: String,
        country: String,
        district: String,
        street: String,
      },
      required: true,
    },
    checkout: {
      type: {
        originPrice: Number,
        discountedPrice: Number,
        feeShip: Number,
        totalDiscount: Number,
      },
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "canceled", "delivered"],
      default: "pending",
    },
    products: {
      type: Array,
      default: [],
    },
    payment: {
      type: Object,
      default: {},
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
