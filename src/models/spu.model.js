const mongoose = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");
const { generateId } = require("../utils");
const productTypeModel = require("./product.type.model");
const COLLECTION_NAME = "SPUs";
const DOCUMENT_NAME = "spu";
var spuSchema = new mongoose.Schema(
  {
    id: { type: String, default: generateId() },
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
    stock: {
      type: Number,
    },
    catagories: {
      type: Array,
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
      required: true,
    },
    attribute: {
      type: {
        attr_name: { type: String, required: true },
        attr_item_id: { type: String, required: true },
      },
      required: true,
    },
    /* {
            attrName:12345,
            attrValues: [
                name
            ]
        } 
    */
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
    /* 
        tier_varation :[
            {
                images: [],
                name: "color"
                options:["req","green"]
            },{
                name:"size",
                images: []
                options:["S","M"]
            }
        ]
    */
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
    isDeleted: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
//index
spuSchema.index({ name: "text", description: "text" });

//middleware

spuSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, spuSchema);
