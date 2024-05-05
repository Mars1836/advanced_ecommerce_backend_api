const EmailService = require("./email.service");
const userModel = require("../models/user.model");
const otpModel = require("../models/otp.model");
const { BadRequestError, ErrorResponse } = require("../core/error.response");
const OTPService = require("./otp.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const utils = require("../utils");

class UserService {
  static async create(payload) {
    const user = await userModel.create(payload);
    return user;
  }
  static async register() {
    const email = "hauhpll123@gmail.com";
    const tempName = email.slice(0, email.search("@"));
    const temppassword = email;
    const hashPassword = await bcrypt.hash(temppassword, 10);
    const newUser = await userModel.create({
      name: tempName,
      email,
      slug: tempName,
      password: hashPassword,
    });
    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey: publicKey,
        privateKey: privateKey,
      });
      if (!keyStore) {
        throw new BadRequestError("Key store error");
      }
      // const publicKeyObect = crypto.createPublicKey(publicKeyString);
      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey
      );
      return {
        shop: utils.getInforData({
          fields: ["_id", "name", "email"],
          object: newUser,
        }),
        tokens,
      };
    }
  }

  static async createWithVerifyEmail({ email }) {
    const storedUser = await userModel.findOne({ email }).lean();
    console.log(storedUser);
    if (storedUser) {
      throw new ErrorResponse("Email already exists");
    }
    const result = await EmailService.sendVerifyEmail({ receiver: email });
    return {
      token: result,
    };
  }
  static async checkVerifyEmailForCreate({ token }) {
    const { email } = await OTPService.checkToken({ token });
    const tempName = email.slice(0, email.search("@"));
    const temppassword = email;
    const hashPassword = await bcrypt.hash(temppassword, 10);
    const newUser = await userModel.create({
      name: tempName,
      email,
      slug: tempName,
      password: hashPassword,
    });
    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey: publicKey,
        privateKey: privateKey,
      });
      if (!keyStore) {
        throw new BadRequestError("Key store error");
      }
      // const publicKeyObect = crypto.createPublicKey(publicKeyString);
      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey
      );
      return {
        shop: utils.getInforData({
          fields: ["_id", "name", "email"],
          object: newUser,
        }),
        tokens,
      };
    }
  }
}
module.exports = UserService;
