const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Carts";
const DOCUMENT_NAME = "cart";
// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      enum: ["active", "completed", "failed", "pending"],
      required: true,
      default: "active",
    },
    productIds: {
      type: [
        {
          spuId: String,
          skuId: String,
          name: String,
          quantity: Number,
        },
      ],
      required: true,
      default: [],
      /* [
            {   
                productId
                ,shopId
                ,name,
                quantity
            }
         ] */
    },
    countProduct: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Types.ObjectId, // number
      required: true,
      unique: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);
