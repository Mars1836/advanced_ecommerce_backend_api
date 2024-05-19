const HEADER = {
  KEY: "x-api-key", // public key
  SHOP_AUTHORIZATION: "s-authorization", //accessToken
  SHOP_ID: "x-s-id", // shop id or user id
  SHOP_REFRESHTOKEN: "s-refreshtoken",
  USER_AUTHORIZATION: "u-authorization", //accessToken
  USER_ID: "x-u-id", // shop id or user id
  USER_REFRESHTOKEN: "u-refreshtoken",
  ADMIN_AUTHORIZATION: "a-authorization", //accessToken
  ADMIN_ID: "x-a-id", // shop id or ADMIN id
  ADMIN_REFRESHTOKEN: "a-refreshtoken",
};
const constant = { HEADER };
module.exports = constant;
