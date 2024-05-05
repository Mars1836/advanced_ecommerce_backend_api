const { ErrorResponse } = require("../core/error.response");
const otpModel = require("../models/otp.model");
class OTPService {
  static generateOTP() {
    let digits = "0123456789";
    let OTP = "";
    let len = digits.length;
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * len)];
    }

    return OTP;
  }

  static async create({ email = null }) {
    const token = this.generateOTP();
    const otp = await otpModel.create({
      email,
      token,
    });
    return otp;
  }
  static async checkToken({ token }) {
    const storedToken = await otpModel.findOne({ token });
    if (!storedToken) {
      throw new ErrorResponse("Token not found!");
    }
    await otpModel.deleteOne({ token });
    return storedToken;
  }
}
module.exports = OTPService;
