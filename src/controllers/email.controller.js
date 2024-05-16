const { SuccessResponse } = require("../core/success.response");
const EmailService = require("../services/email.service");

class EmailController {
  static async sendVerifyEmail(req, res, next) {
    const { email } = req.body;
    const metadata = await EmailService.sendVerifyEmail({
      email,
    });
    new SuccessResponse({ metadata, message: "send email success" }).send(res);
  }
}
module.exports = EmailController;
