"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const utils = require("../utils");
const {
  ErrorResponse,
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const ShopService = require("./shop.service");
const { getInforData } = require("../utils");
const { createTokenPair } = require("../auth/authUtils");
const JWT = require("jsonwebtoken");
const RoleShop = {
  ADMIN: "000",
  SHOP: "001",
  WRITER: "002",
  EDITER: "003",
};
class AccessService {
  static handleAccessTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteByUserId({ userId: userId });
      throw new ForbiddenError("Something wrong happened! Pls relogin!");
    }
    if (keyStore.refreshToken != refreshToken) {
      throw new AuthFailureError("Invalid token!");
    }

    const storedShop = await ShopService.findByEmail({ email });
    if (!storedShop) {
      throw AuthFailureError("Shop is not registed");
    }
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      keyStore.publicKey,
      keyStore.privateKey
    );
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: { refreshTokensUsed: refreshToken },
    });
    return {
      shop: utils.getInforData({
        fields: ["_id", "name", "email"],
        object: storedShop,
      }),
      tokens,
    };
  };
  static handleAccessToken = async ({ refreshToken }) => {
    console.log("refreshtoken", refreshToken);
    const unauthToken = await KeyTokenService.findByRefreshTokenUsed({
      refreshTokenUsed: refreshToken,
    });

    if (unauthToken) {
      // refreshtoken da su dung hay chua // kiem tra tinh hop le cua refreshtoken

      const { userId, email } = JWT.verify(
        refreshToken,
        unauthToken.privateKey
      );
      await KeyTokenService.deleteByUserId({ userId });
      throw new ForbiddenError("Something wrong happend !! Please login again");
    }
    const authToken = await KeyTokenService.findByRefreshToken({
      refreshToken,
    });
    if (!authToken) {
      throw new AuthFailureError("Token is not valid");
    }
    const { userId, email } = JWT.verify(refreshToken, authToken.privateKey);
    const storedShop = await ShopService.findByEmail({ email });
    if (!storedShop) {
      throw AuthFailureError("Shop is not registed");
    }
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      authToken.publicKey,
      authToken.privateKey
    );
    await authToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: { refreshTokensUsed: refreshToken },
    });
    return {
      shop: utils.getInforData({
        fields: ["_id", "name", "email"],
        object: storedShop,
      }),
      tokens,
    };
  };
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeById(keyStore._id);
    console.log(delKey);
    return delKey;
  };
  static signIn = async ({ email, password, refreshToken = null }) => {
    if (!email) {
      throw new BadRequestError("Email or password has not been entered!");
    }
    const storedShop = await ShopService.findByEmail({ email });
    if (!storedShop) {
      throw new AuthFailureError("Authentication error");
    }

    const isMatchPassword = bcrypt.compare(password, storedShop.password);
    if (!isMatchPassword) {
      throw new AuthFailureError("Authentication error");
    }
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    const tokens = await createTokenPair(
      { userId: storedShop._id, email: storedShop.email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId: storedShop._id,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      shop: getInforData({
        fields: ["_id", "email", "name"],
        object: storedShop,
      }),
      tokens,
    };
  };
  static signUp = async ({ name, email, password }) => {
    // check email exits
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Your email already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey: publicKey,
        privateKey: privateKey,
      });
      if (!keyStore) {
        throw new BadRequestError("Key store error");
      }
      // const publicKeyObect = crypto.createPublicKey(publicKeyString);
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      return {
        shop: utils.getInforData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }
  };
}
module.exports = AccessService;
