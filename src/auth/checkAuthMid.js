"use strict";

const { HEADER } = require("../const");
const ApikeyService = require("../services/apikey.service");

const apiKeyMid = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.KEY]?.toString();
    if (!key) {
      return res.status(403).json({ message: "forbidden Error" });
    }
    const storedKey = await ApikeyService.findByKey(key);
    if (!storedKey) {
      return res.status(403).json({ message: "forbidden Error" });
    }
    req.objKey = storedKey;
    next();
  } catch (error) {
    console.log(error);
  }
};
const permission = (permission) => {
  return (req, res, next) => {
    try {
      const permissions = req.objKey.permissions;
      if (!permissions) {
        res.status(403).json({ message: "permission denied!" });
      }
      const isValidPermission = permissions.includes(permission);
      if (!isValidPermission) {
        res.status(403).json({ message: "permission denied!" });
      }
      next();
    } catch (error) {
      console.log(error);
    }
  };
};

const auth = { apiKeyMid, permission };
module.exports = auth;
