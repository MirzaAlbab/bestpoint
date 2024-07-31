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
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (file.mimeType.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ErrorHandler("Only images are allowed"));
    }
  },
});
