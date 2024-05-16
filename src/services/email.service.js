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

  static async sendVerifyEmail({ email }) {
    const otp = await OTPService.create({ email });
    const infor = await this.transport.sendMail({
      from: "notme.1308@gmail.com",
      to: email,
      subject: "Verify user",
      text: "",
      html: otpEmailTemp({
        email,
        verificationLink: `${cstRoute.root}${cstRoute.verifyEmailApi}?token=${otp.token}`,
        appName: "shopDEV",
      }),
    });
    return infor;
  }
  static async sendPwdReminder({ email, password }) {
    const infor = await this.transport.sendMail({
      from: "notme.1308@gmail.com",
      to: email,
      subject: "Provide shopdev password",
      text: `Hi ${email}`,
      html: `<b>Hello, <strong>${email}</strong>, Your password is:\n<b>${password}</b>.`,
    });
    return infor;
  }
}
module.exports = EmailService;
