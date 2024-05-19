const express = require("express");
const { apiKeyMid, permission } = require("../auth/checkAuthMid");
const { NotFoundError } = require("../core/error.response");
const logger = require("../loggers/winston");
const { logToDiscord } = require("../middlewares");
const cstRoute = require("../const/routes");
const UserController = require("../controllers/user.controller");
const asyncHandler = require("../helpers/async.handler");
const router = express.Router();
router.use(logToDiscord);

//verify user from email
router.get(
  cstRoute.verifyEmailApi,
  asyncHandler(UserController.checkVerifyEmailForCreate)
);
//redis route test
router.use("/v1/api/key", require("./key"));

//middleware

//check api key
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
// router.use("/v1/api/email", require("./email"));
router.use("/v1/api/user", require("./user"));
router.use("/v1/api/attr", require("./attribute"));
router.use("/v1/api/review", require("./review"));
router.use((req, res, next) => {
  const error = new NotFoundError("Page not foundddd");
  next(error);
});

router.use((error, req, res, next) => {
  const resMes = `${error.status}-${
    Date.now() - error.time
  }ms-Response:${JSON.stringify(error)}`;
  console.log("erorr________________________________________________");
  logger.error(resMes, [
    req.path,
    { requestId: req.requestId },
    { message: error.message },
  ]);
  res.status(error.status || 500).json({
    message: error.message,
  });
});
module.exports = router;
