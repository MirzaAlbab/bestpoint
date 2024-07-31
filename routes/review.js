const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const isValidObjectId = require("../middleware/isValidObjectId");
const isAuth = require("../middleware/isAuth");
const { isAuthorReview } = require("../middleware/isAuthor");
const ReviewControllrer = require("../controllers/review");
const { validateReview } = require("../middleware/validator");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isAuth,
  isValidObjectId("/places"),
  validateReview,
  wrapAsync(ReviewControllrer.store)
);

router.delete(
  "/:review_id",
  isAuth,
  isAuthorReview,
  isValidObjectId("/places"),
  wrapAsync(ReviewControllrer.destroy)
);

module.exports = router;
