const multer = require("multer");

const memoryStorage = multer.memoryStorage();

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const memoryUpload = multer({ storage: memoryStorage });
const diskUpload = multer({ storage: diskStorage });
module.exports = {
  memoryUpload,
  diskUpload,
};
