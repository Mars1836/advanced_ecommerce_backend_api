const apikeyModel = require("../models/apikey.model");

class KeyService {
  static async create({ key, permissions = ["0000"] }) {
    const newKey = await apikeyModel.create({
      key,
      permissions,
    });
    return newKey;
  }
}
module.exports = KeyService;
