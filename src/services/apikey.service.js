"use strict";

const apikeyModel = require("../models/apikey.model");
const crypto = require("crypto");
class ApikeyService {
  static findByKey = async (key) => {
    const objectKey = await apikeyModel.findOne({ key, status: true }).lean();
    return objectKey;
  };
  static create = async (key) => {
    if (!key) {
      key = crypto.randomBytes(64).toString("hex");
    }

    const objectKey = await apikeyModel
      .create({ key, status: true, permissions: ["0000"] })
      .lean();
    return objectKey;
  };
}
module.exports = ApikeyService;
