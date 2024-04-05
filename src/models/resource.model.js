const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const COLLECTION_NAME = "Resources";
const DOCUMENT_NAME = "resource";
const grantList = [
  { role: "admin", resource: "profile", action: "update:any", attribute: "*" },
  {
    role: "admin",
    resource: "balance",
    action: "update:any",
    attribute: "*, !amount",
  },
  { role: "shop", resource: "balance", action: "update:own", attribute: "*" },
  {
    role: "shop",
    resource: "balance",
    action: "update:own",
    attribute: "*, !amount",
  },
  { role: "user", resource: "profile", action: "update:own", attribute: "*" },
  { role: "user", resource: "profile", action: "read:own", attribute: "*" },
];
var resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, resourceSchema);
