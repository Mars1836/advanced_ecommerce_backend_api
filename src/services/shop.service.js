const shopModel = require("../models/shop.model");

class ShopService {
  static findByEmail = async ({
    email,
    select = { email: 1, password: 1, name: 1, status: 1, roles: 1 },
  }) => {
    const storedShop = shopModel.findOne({ email }).select(select).lean();
    return storedShop;
  };
  static findById = async ({
    id,
    select = { email: 1, password: 1, name: 1, status: 1, roles: 1 },
  }) => {
    const storedShop = shopModel.findById(id).select(select).lean();
    return storedShop;
  };
}
module.exports = ShopService;
