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
const CartService = require("./cart.service");

class UserService {
  static async findByEmail({
    email,
    select = { email: 1, password: 1, name: 1, status: 1, roles: 1 },
  }) {
    const user = await userModel.findOne({ email }).select(select).lean();
    return user;
  }
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
      roles: ["user"],
    });
    if (newUser) {
      const newCart = await CartService.create({ userId: newUser._id });
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
      EmailService.sendPwdReminder({ email, password: temppassword });
      return {
        shop: utils.getInforData({
          fields: ["_id", "name", "email"],
          object: newUser,
        }),
        tokens,
      };
    }
  }
  static async getRoleByUserId(id) {
    let user = await userModel.findById(id).lean();
    if (!user) {
      throw new Error("User does not existed");
    }

    const roleids = user.roles;
    let roles = await roleModel.find({
      _id: {
        $in: [roleids],
      },
    });
    return roles;
  }
}
module.exports = UserService;
