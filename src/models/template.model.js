const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Templates";
const DOCUMENT_NAME = "template";
// Declare the Schema of the Mongo model
var templateModel = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    status: { type: String, default: "active" },
    html: { type: String, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, templateModel);
