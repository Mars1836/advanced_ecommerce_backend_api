const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

let s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_KEY,
    secretAccessKey: process.env.AWS_BUCKET_SERCET_KEY,
  },
});
module.exports = { s3Client, GetObjectCommand, PutObjectCommand };
