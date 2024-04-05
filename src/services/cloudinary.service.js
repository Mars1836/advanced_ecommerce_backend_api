const cloudinary = require("../configs/cloudinary.config");
const { BadRequestError } = require("../core/error.response");
class CloudinaryService {
  static async uploadImageFromUrl({ url, path }) {
    const target = url ? url : path;
    const folderName = "shopDEV";
    try {
      const result = await cloudinary.uploader.upload(target, {
        // public_id: newFileName  # filename if not a filename is auto generate
        folder: folderName,
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new BadRequestError(error.message || "Error when upload image");
    }
  }
}

module.exports = CloudinaryService;
