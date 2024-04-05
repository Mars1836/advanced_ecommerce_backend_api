const { BadRequestError, NotFoundError } = require("../core/error.response");
const Payload = require("../helpers/payload.handler");
const productModel = require("../models/product.model");
const productTypeModel = require("../models/product.type.model");
const InventoryRepo = require("../models/repositories/inventory.repo");
const ProductRepo = require("../models/repositories/product.repo");
const NotificationService = require("./notification.service");

class ProductService {
  // product factory
  static types = {};
  static registerType(type, classRef) {
    if (!type || !classRef) {
      throw new Error("Class of type is invalid");
    }

    ProductService.types[type] = classRef;
  }
  // delete product

  static async delete({ type, id, name, shopId }, options) {
    const payload = new Payload();
    payload.loadData({ type, id, name, shopId });

    return await ProductRepo.remove(payload.data, options);
  }

  // create document//

  //create one by one
  static async create(payload, options) {
    const { type } = payload;
    const typeClass = ProductService.types[type];
    if (!typeClass) {
      throw new BadRequestError(`Invalid type of product`);
    }

    return new typeClass(payload).create();
  }
  // create many
  static async createMany({ payload = [], shopId }, options) {
    console.log("payload", payload);
    const data = payload.map(async (item) => {
      return await this.create({ type: item.type, payload: item, shopId });
    });
    return data;
  }

  //query
  static async findAll({
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
    limit = 50,
    select = ["name", "price", "thumb", "shopId", "updatedAt"],
  }) {
    return ProductRepo.findAll({
      sort,
      page,
      filter,
      limit,
      select,
    });
  }
  static async findAllByDraftOfShop(
    { isDraft = true, shopId, options },
    { sort, page, filter, limit, select }
  ) {
    const query = { isDraft, shopId };
    console.log(query);
    return await ProductRepo.findAllByDraftOfShop(query, options);
  }
  static async findById({ id }, { select, unSelect, lean }) {
    const options = { select, unSelect, lean };
    const query = { id };
    const product = await ProductRepo.findById(query, options);

    return product;
  }
  static async findAllByShop(
    { shopId },
    { sort, page, filter, limit, select }
  ) {
    const options = { sort, page, filter, limit, select };
    const query = { shopId };
    return await ProductRepo.findAllByQuery(query, options);
  }
  static async findAllDraftsOfShop(
    { shopId },
    { sort, page, filter, limit, select }
  ) {
    const options = { sort, page, filter, limit, select };
    const query = { isDraft: true, shopId };
    return await ProductRepo.findAllByQuery(query, options);
  }
  static async findAllUnDraftsOfShop(
    { shopId },
    { sort, page, filter, limit, select }
  ) {
    const options = { sort, page, filter, limit, select };
    const query = { isDraft: false, shopId };
    return await ProductRepo.findAllByQuery(query, options);
  }
  static async findAllPublishOfShop(
    { shopId },
    { sort, page, filter, limit, select }
  ) {
    const query = { isPublished: true, shopId };
    const options = { sort, page, filter, limit, select };
    return await ProductRepo.findAllByQuery(query, options);
  }
  static async searchByUser(
    { keySearch },
    { sort, page, filter, limit, select }
  ) {
    const options = { sort, page, filter, limit, select };
    const query = keySearch;
    return await ProductRepo.searchByUser(query, options);
  }

  //update
  //update infor product
  static async updateById({ id, shopId }, update, options) {
    const query = { id, shopId };
    options.new = true;
    return await ProductRepo.updateById(query, update, options);
  }

  //update publish state
  static async publishProductByShop({ id, shopId }, options) {
    const query = { shopId, id };
    const update = { isPublished: true, isDraft: false };
    return await ProductRepo.togglePublishedByShop(query, update);
  }
  static async unPublishProductByShop({ id, shopId }, options) {
    const query = { shopId, _id: id };
    const update = { isPublished: false, isDraft: true };
    return await ProductRepo.togglePublishedByShop(query, update, options);
  }

  // check if product is match with database
  static async checkout(products = [], shopId) {
    if (!products?.length) {
      throw new BadRequestError("Product list is invalid");
    }
    return await Promise.all(
      products.map(async (prod) => {
        const select = ["name", "price"];

        const query = {
          _id: prod.productId,
          shopId: shopId,
        };

        const productStored = await productModel
          .findOne(query)
          .select(select)
          .lean();
        if (!productStored) {
          throw new NotFoundError("Not found product");
        }
        return {
          quantity: prod.quantity,
          productId: prod.productId,
          ...productStored,
        };
      })
    );
  }
}
class Product {
  constructor({
    name,
    thumb,
    description,
    price,
    quantity,
    type,
    shopId,
    attributes,
  }) {
    this.name = name;
    this.thumb = thumb;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.type = type;
    this.shopId = shopId;
    this.attributes = attributes;
  }
  async create({ id }) {
    const product = await productModel.create(id ? { ...this, _id: id } : this);
    if (product) {
      const payload = {
        productId: product._id,
        stock: this.quantity,
        shopId: this.shopId,
      };
      await InventoryRepo.create(payload);
      NotificationService.push({
        type: "PRODUCT-001",
        receivedId: 1,
        senderId: this.shopId,
        options: {
          shopName: this.shopId,
          productName: this.name,
        },
      })
        .then((rs) => {
          console.log(rs);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return product;
  }
}
class Clothes extends Product {
  async deleteAll() {
    // admin permisstion
    return await productTypeModel.clothes.deleteMany({});
  }
  async create() {
    const clothes = await productTypeModel.clothes.create({
      ...this.attributes,
      shopId: this.shopId,
    });
    if (!clothes) {
      throw new BadRequestError("create new clothes error");
    }
    const product = await super.create({ id: clothes._id });
    if (!product) {
      throw new BadRequestError("create new product error");
    }
    return product;
  }
}
class Electronics extends Product {
  async deleteAll() {
    // admin permisstion
    return await productTypeModel.electronics.deleteMany({});
  }
  async create() {
    const elec = await productTypeModel.electronics.create({
      ...this.attributes,
      shopId: this.shopId,
    });
    if (!elec) {
      throw new BadRequestError("create new electronics error");
    }
    const product = await super.create({ id: elec._id });
    if (!product) {
      throw new BadRequestError("create new product error");
    }
    return product;
  }
}
class Furniture extends Product {
  async deleteAll() {
    // admin permisstion
    return await productTypeModel.furniture.deleteMany({});
  }
  async create() {
    const furniture = await productTypeModel.furniture.create({
      ...this.attributes,
      shopId: this.shopId,
    });
    if (!furniture) {
      throw new BadRequestError("create new furniture error");
    }
    const product = await super.create({ id: furniture._id });
    if (!product) {
      throw new BadRequestError("create new product error");
    }
    return product;
  }
}
ProductService.registerType("Clothes", Clothes);
ProductService.registerType("Electronics", Electronics);
ProductService.registerType("Furniture", Furniture);

module.exports = ProductService;
