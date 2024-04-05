const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
console.log(process.env.CLOUDINARY_NAME);
console.log("asdkasladklasjdlkasjdlkasdklasdlkasjdlksjakl");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SERCET,
});

// Log the configuration
module.exports = cloudinary;
