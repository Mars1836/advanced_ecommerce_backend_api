const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Keys";
const DOCUMENT_NAME = "key";
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
  {
    objectType: {
      type: String,
      enum: ["shop", "user"],
      required: true,
    },
    objectId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
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
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
