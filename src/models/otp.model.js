const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "OTPs";
const DOCUMENT_NAME = "otp";
// Declare the Schema of the Mongo model
var otpModel = new mongoose.Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "block"],
      default: "active",
    },
    expireAt: { type: Date, expires: 300 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, otpModel);
