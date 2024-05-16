const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const COLLECTION_NAME = "Roles";
const DOCUMENT_NAME = "role";
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
var roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
    },
    grants: [
      {
        recourse: {
          type: String,
          required: true,
        },
        actions: [
          {
            type: String,
            required: true,
          },
        ],
        attributes: {
          type: String,
          default: "*",
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, roleSchema);
