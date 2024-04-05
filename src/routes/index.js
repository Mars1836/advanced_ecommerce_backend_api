const express = require("express");
const { apiKeyMid, permission } = require("../auth/checkAuthMid");
const { logToDiscord } = require("../middlewares");

const router = express.Router();
router.use(logToDiscord);
//redis route test
router.use("/v1/api/key", require("./key"));

//middleware
router.use(apiKeyMid);
router.use(permission("0000"));
// define the home page route
router.use("/v1/api/auth", require("./access"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/comment", require("./comment"));
router.use("/v1/api/notification", require("./notification"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/order", require("./order"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/upload", require("./upload"));
router.use("/v1/api/profile", require("./profile"));
router.use("/v1/api/rbac", require("./rbac"));
router.use((req, res, next) => {
  const error = {
    statusCode: 404,
    message: "Page not found",
  };
  next(error);
});

router.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500).json({
    message: error.message,
  });
});
module.exports = router;
