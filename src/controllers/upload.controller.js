"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const S3Service = require("../services/aws_s3.service");

const CloudinaryService = require("../services/cloudinary.service");
class UploadController {
  static async cloudinaryUploadByUrl(req, res, next) {
    const { url } = req.body;
    console.log("body", req.body);
    const metadata = await CloudinaryService.uploadImageFromUrl({
      url,
    });

    new SuccessResponse({
      message: "Upload image success!",
      metadata,
    }).send(res);
  }
  static async cloudinaryUploadByLocalPath(req, res, next) {
    const { file } = req;
    const metadata = await CloudinaryService.uploadImageFromUrl({
      path: file.path,
    });

    new SuccessResponse({
      message: "Upload image success!",
      metadata,
    }).send(res);
  }
  static async s3UploadByLocalPath(req, res, next) {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }
    console.log(file);
    const metadata = await S3Service.uploadImageFromUrl({
      file,
    });

    new SuccessResponse({
      message: "Upload image success!",
      metadata,
    }).send(res);
  }
}
module.exports = UploadController;
