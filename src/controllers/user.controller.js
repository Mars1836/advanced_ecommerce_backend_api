const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
  static async createWithVerifyEmail(req, res, next) {
    const { email } = req.body;
    const metadata = await UserService.createWithVerifyEmail({ email });
    new SuccessResponse({
      message: "Send verify email success",
      metadata: metadata,
    }).send(res);
  }
  static async checkVerifyEmailForCreate(req, res, next) {
    const { token } = req.query;
    const metadata = await UserService.checkVerifyEmailForCreate({ token });
    new SuccessResponse({
      message: "Create user success",
      metadata: metadata,
    }).send(res);
  }
  static async register(req, res, next) {
    const metadata = await UserService.register();
    new SuccessResponse({
      message: "Create user success",
      metadata: metadata,
    }).send(res);
  }
}
module.exports = UserController;
