const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");
class KeyTokenService {
  // static createKeyToken = async ({ userId, publicKey, privateKey }) => {
  //   try {
  //     const keyTokens = await keytokenModel.create({
  //       user: userId,
  //       publicKey,
  //       privateKey,
  //     });
  //     return keyTokens;
  //   } catch (error) {
  //     return error;
  //   }
  // };

  static createKeyToken = async ({
    objectId,
    objectType,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    const filter = {
      objectId,
      objectType,
    };
    const update = {
      publicKey,
      privateKey,
      refreshTokenUsed: [],
      refreshToken,
    };
    const options = {
      new: true, // return new record after update was applied
      upsert: true, // create new one if these is no document was founded
    };
    const keyTokens = await keytokenModel.findOneAndUpdate(
      filter,
      update,
      options
    );
    return keyTokens ? keyTokens.privateKey : null;
  };
  static findByObject = async ({ objectType, objectId }) => {
    return await keytokenModel.findOne({ objectType, objectId });
  };
  static deleteByObject = async ({ objectId, objectType }) => {
    const delKey = await keytokenModel.deleteOne({
      objectId,
      objectType,
    });
    return delKey;
  };
  static findByRefreshTokenUsed = async ({ refreshTokenUsed }) => {
    const keyStore = await keytokenModel.findOne({
      refreshTokensUsed: refreshTokenUsed,
    });
    return keyStore;
  };
  static findByRefreshToken = async ({ refreshToken }) => {
    return await keytokenModel.findOne({ refreshToken });
  };
  static deleteByUserId = async ({ userId }) => {
    return await keytokenModel.deleteOne({ user: userId });
  };
}
module.exports = KeyTokenService;
