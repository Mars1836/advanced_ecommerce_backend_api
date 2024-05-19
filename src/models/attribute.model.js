const mongoose = require("mongoose"); // Erase if already required
const { generateId } = require("../utils");
const COLLECTION_NAME = "Attributes";
const DOCUMENT_NAME = "attibute";
const COLLECTION_NAME_ITEM = "Attribute_items";
const DOCUMENT_NAME_ITEM = "attibute_item";
// Declare the Schema of the Mongo model
var attrShema = new mongoose.Schema(
  {
    id: { type: String, default: generateId() },
    name: { type: String, required: true, unique: true },
    form: {
      type: [
        {
          key: { type: String, required: true },
          type: {
            type: String,
            required: true,
          },
          required: {
            type: Boolean,
            default: true,
          },
        },
      ],
      require: true,
    },
    description: { type: String },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
var attrItemShema = new mongoose.Schema(
  {
    id: { type: String, default: generateId() },
    name: { type: String, required: true },
    description: { type: String },
    attrId: { type: String, required: true },
    spec: {
      type: Object,
      required: true,
      default: {},
    },
  },

  {
    collection: COLLECTION_NAME_ITEM,
    timestamps: true,
  }
);
//Export the model
module.exports = {
  attrModel: mongoose.model(DOCUMENT_NAME, attrShema),
  attrItemModel: mongoose.model(DOCUMENT_NAME_ITEM, attrItemShema),
};
