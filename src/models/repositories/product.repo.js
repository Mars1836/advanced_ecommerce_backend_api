const { BadRequestError } = require("../../core/error.response");
const {
  handleIdToObjectId,
  getSelectData,
  getUnSelectData,
  partialUpdate,
  filterNoValueField,
} = require("../../utils");
const productModel = require("../product.model");
const productTypeModel = require("../product.type.model");
class ProductRepo {
  //query
  static findAll = async ({ sort, page, filter, limit, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = await productModel
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();
    return products;
  };
  static searchByUser = async (query, options = {}) => {
    const { page, limit, select } = options;
    return await productModel
      .find(
        {
          isPublished: true,
          $text: { $search: query },
        },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  };
  static findById = async (query, { select = [], unSelect = [], lean }) => {
    query = handleIdToObjectId(query);
    let selectOp = getSelectData([
      "name",
      "_id",
      "thumb",
      "description",
      "shopId",
      "price",
    ]);
    if (unSelect?.length > 0) {
      selectOp = getUnSelectData(unSelect);
    } else if (select?.length > 0) {
      selectOp = getSelectData(select);
    }
    return productModel.findOne(query).select(selectOp).lean();
  };
  static findAllByQuery = async (
    query,
    { page = 1, sort, skip = 0, limit = 100, select = [], unSelect = [] }
  ) => {
    skip = (page - 1) * limit;
    const defaultOps = {
      sort: {
        updateAt: -1,
      },
      skip: 0,
      limit: 100,
      select: getSelectData([
        "name",
        "_id",
        "thumb",
        "description",
        "shopId",
        "price",
      ]),
    };
    let selectOp = defaultOps.select;
    if (unSelect.length > 0) {
      selectOp = getUnSelectData(unSelect);
    } else if (select.length > 0) {
      selectOp = getSelectData(select);
    }
    return await productModel
      .find(query)
      .sort(sort ? { ...defaultOps.sort, ...sort } : defaultOps.sort)
      .skip(+skip || defaultOps.skip)
      .limit(+limit || defaultOps.limit)
      .select(selectOp)
      .lean();
  };

  //update
  //update product infor

  static updateById = async (query, update, options) => {
    query = handleIdToObjectId(query);
    filterNoValueField(update);
    const product = await productModel.findOne(query);

    if (!product) {
      throw new Error("This product is not exist!");
    }
    // if (update.type && update.attributes) {

    // } else if (update.type) {
    // } else if (update.attributes) {
    // }
    if (update?.type && update.type !== product.type) {
      throw new BadRequestError("Can't change type of product");
    }
    if (update?.attributes) {
      const typeModel = productTypeModel[product.type.toLowerCase()];
      if (typeModel) {
        await typeModel.updateOne({ _id: product._id }, update.attributes);
      }
    }
    partialUpdate(product, update);

    return await product.save();
  };
  //update state publish
  static togglePublishedByShop = async (
    query,
    { isPublished, isDraft },
    options
  ) => {
    query = handleIdToObjectId(query);
    return await productModel.findOneAndUpdate(
      query,
      { isPublished, isDraft },
      options
    );
  };
  static remove = async (query, options) => {
    query = handleIdToObjectId(query);
    const product = productModel.findOne(query);
    return await product.deleteOne(query);
  };
}

module.exports = ProductRepo;
