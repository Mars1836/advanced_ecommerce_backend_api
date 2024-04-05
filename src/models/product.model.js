const mongoose = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");
const productTypeModel = require("./product.type.model");
const COLLECTION_NAME = "Products";
const DOCUMENT_NAME = "product";
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    thumb: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Clothes", "Electronics", "Furniture"],
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
    },
    attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be beneath 5"],
      set: (val) => {
        return Math.round(val * 10) / 10;
      },
    },
    variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
//index
productSchema.index({ name: "text", description: "text" });

//middleware

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre("deleteOne", { document: true }, async function (next) {
  console.log(this);
  const type = this.type.toLowerCase();
  const typeModel = productTypeModel[type];
  if (typeModel) {
    await typeModel.deleteOne({ _id: this._id });
  }
  next();
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, productSchema);
