const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const COLLECTION_NAME = "Users";
const DOCUMENT_NAME = "user";
var userSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    salf: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    date_of_birth: {
      type: Date,
      default: null,
    },
    roles: {
      type: [String],
      default: ["user"],
    },
    status: {
      type: String,
      enum: ["pending", "active", "block"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
