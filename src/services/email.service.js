const OTPService = require("./otp.service");
const TemplateService = require("./template.service");
const nodemailer = require("nodemailer");
const { transport } = require("winston");
const { otpEmailTemp } = require("../const/html.template/otp.email.temp");
const cstRoute = require("../const/routes");
require("dotenv").config();

class EmailService {
  static transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  static async sendVerifyEmail({ receiver }) {
    const otp = await OTPService.create({ email: receiver });
    console.log(otp);
    const infor = await this.transport.sendMail({
      from: "notme.1308@gmail.com",
      to: receiver,
      subject: "Verify user",
      text: "",
      html: otpEmailTemp({
        email: receiver,
        verificationLink: `${cstRoute.root}${cstRoute.verifyEmailApi}?token=${otp.token}`,
        appName: "shopDEV",
      }),
    });
    return infor;
  }
}
module.exports = EmailService;
