"use strict";
const JWT = require("jsonwebtoken");
const { HEADER } = require("../const");
const { AuthFailureError, ForbiddenError } = require("../core/error.response");
const asyncHandler = require("../helpers/async.handler");
const KeyTokenService = require("../services/keyToken.service");
const ShopService = require("../services/shop.service");
const utils = require("../utils");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: "RS256",
      expiresIn: "30 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "60 days",
    });

    JWT.verify(accessToken, publicKey, function (err, decoded) {
      if (err) {
        console.log("error verify:", err);
      } else {
        console.log("decode verify:", decoded);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("token error: ", error);
  }
};
const authentication = async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid request");
  }
  const keyStore = await KeyTokenService.findByUserId({ userId });
  if (!keyStore) {
    throw new AuthFailureError("Invalid userId");
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Authentication must be provided");
  }
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid userId");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
};
const verify = async (req, res, next, objectType) => {
  let id, atoken, rtoken;

  if (objectType === "shop") {
    id = req.headers[HEADER.SHOP_ID];
    atoken = req.headers[HEADER.SHOP_AUTHORIZATION];
    rtoken = req.headers[HEADER.SHOP_REFRESHTOKEN];
    req.shop = {};
  }
  if (objectType === "user") {
    id = req.headers[HEADER.USER_ID];
    atoken = req.headers[HEADER.USER_AUTHORIZATION];
    rtoken = req.headers[HEADER.USER_REFRESHTOKEN];
    req.user = {};
  }
  if (objectType === "admin") {
    id = req.headers[HEADER.ADMIN_ID];
    atoken = req.headers[HEADER.ADMIN_AUTHORIZATION];
    rtoken = req.headers[HEADER.ADMIN_REFRESHTOKEN];
    req.admin = {};
  }
  if (!id) {
    throw new AuthFailureError("Invalid request");
  }

  const keyStore = await KeyTokenService.findByObject({
    objectId: id,
    objectType,
  });

  if (!keyStore) {
    throw new AuthFailureError("Invalid request");
  }
  if (rtoken) {
    try {
      const decode = JWT.verify(rtoken, keyStore.privateKey);
      if (objectType === "shop") {
        req.shop.keyStore = keyStore;
        req.shop.refreshToken = rtoken;
        req.shop.ob = decode;
      }
      if (objectType === "user") {
        req.user.keyStore = keyStore;
        req.user.refreshToken = rtoken;
        req.user.ob = decode;
      }
      if (objectType === "admin") {
        req.admin.keyStore = keyStore;
        req.admin.refreshToken = rtoken;
        req.admin.ob = decode;
      }
      return next();
    } catch (error) {
      throw error;
    }
  }
  if (!atoken) {
    throw new AuthFailureError("Authentication must be provided");
  }
  try {
    const decode = JWT.verify(atoken, keyStore.publicKey);
    if (objectType === "shop") {
      req.shop.keyStore = keyStore;
      req.shop.ob = decode;
    }
    if (objectType === "user") {
      req.user.keyStore = keyStore;
      req.user.ob = decode;
    }
    if (objectType === "admin") {
      req.admin.keyStore = keyStore;
      req.admin.ob = decode;
    }
    return next();
  } catch (error) {
    throw error;
  }
};

const verifyAsShop = async (req, res, next) => {
  try {
    await verify(req, res, next, "shop");
  } catch (error) {
    throw error;
  }
};
const verifyAsAdmin = async (req, res, next) => {
  try {
    await verify(req, res, next, "admin");
  } catch (error) {
    throw error;
  }
};
const verifyAsUser = async (req, res, next) => {
  try {
    await verify(req, res, next, "user");
  } catch (error) {
    throw error;
  }
};
const authUtils = {
  authentication,
  createTokenPair,
  verifyAsUser,
  verifyAsShop,
};
module.exports = authUtils;
