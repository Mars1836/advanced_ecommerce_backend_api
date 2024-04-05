const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  s3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("../configs/s3.config");
const crypto = require("crypto");
const { BadRequestError } = require("../core/error.response");
const randomKey = () => {
  return crypto.randomBytes(16).toString("hex");
};
class S3Service {
  static async uploadImageFromUrl({ file }) {
    const key = randomKey();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: "image/jpeg",
    });
    const result = await s3Client.send(command);
    const getcommandObject = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, getcommandObject, {
      expiresIn: 3600,
    });

    return { url };
  }
  catch(error) {
    console.log(error);
    throw new BadRequestError(error.message || "Error when upload image");
  }
}

module.exports = S3Service;
