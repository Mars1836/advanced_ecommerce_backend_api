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
];
const ac = new AccessControl(grants);
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
