const express = require("express");
const { reviewSchema } = require("../schemas/review");
const Place = require("../models/place");
const Review = require("../models/review");
const ErrorHandler = require("../utils/ErrorHandler");
const wrapAsync = require("../utils/wrapAsync");
const isValidObjectId = require("../middleware/isValidObjectId");

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(", ");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};

router.post(
  "/",
  isValidObjectId("/places"),
  validateReview,
  wrapAsync(async (req, res) => {
    const review = new Review(req.body.review);
    const place = await Place.findById(req.params.place_id);
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash("successMsg", "Review saved successfully");
    res.redirect(`/places/${req.params.place_id}`);
  })
);

router.delete(
  "/:review_id",
  isValidObjectId("/places"),
  wrapAsync(async (req, res) => {
    const { place_id, review_id } = req.params;
    await Place.findByIdAndUpdate(place_id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash("successMsg", "Review deleted successfully");
    res.redirect(`/places/${place_id}`);
  })
);

module.exports = router;
