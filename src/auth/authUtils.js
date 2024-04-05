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
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7 days",
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
const authentication = asyncHandler(async (req, res, next) => {
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
});
const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid request");
  }
  const keyStore = await KeyTokenService.findByUserId({ userId });
  if (!keyStore) {
    throw new AuthFailureError("Invalid userId");
  }
  const refreshToken = req.headers[HEADER.REFRESHTOKEN];
  if (refreshToken) {
    try {
      const decode = JWT.verify(refreshToken, keyStore.privateKey);

      req.keyStore = keyStore;
      req.refreshToken = refreshToken;
      req.user = decode;
      return next();
    } catch (error) {
      throw error;
    }
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
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});
const authUtils = { authentication, createTokenPair, authenticationV2 };
module.exports = authUtils;
