const AccessControl = require("accesscontrol");
const { AuthFailureError } = require("../core/error.response");
const grants = [
  {
    role: "admin",
    resource: "profile",
    action: "read:any",
    attributes: "*, !views",
  },
  { role: "shop", resource: "profile", action: "read:own", attributes: "*" },
  { role: "user-0", resource: "cart", action: "read:own", attributes: "*" },
];
const ac = new AccessControl(grants);
const getRole = async (req, res, next) => {
  let userToken = {
    id: req.headers[HEADER.USER_ID],
    atoken: req.headers[HEADER.USER_AUTHORIZATION],
    rtoken: req.headers[HEADER.USER_REFRESHTOKEN],
  };
  let shopToken = {
    id: req.headers[HEADER.SHOP_ID],
    atoken: req.headers[HEADER.SHOP_AUTHORIZATION],
    rtoken: req.headers[HEADER.SHOP_REFRESHTOKEN],
  };
  if (userToken.id && userToken.atoken) {
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
      return next();
    } catch (error) {
      throw error;
    }
  }
};

const grantAccess = (action, resource) => {
  return (req, res, next) => {
    try {
      const role = req.query.role;
      const permission = ac.can(role)[action](resource);
      if (!permission.granted) {
        throw new AuthFailureError("You don't have enough permission.");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
module.exports = grantAccess;
