const multer = require("multer");
const path = require("path");
const ErrorHandler = require("../utils/ErrorHandler");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // fungsi untuk memeriksa format file yang diizinkan
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ExpressError("Only images are allowed.", 405));
    }
  },
});

module.exports = upload;
