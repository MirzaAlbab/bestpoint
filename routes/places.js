const express = require("express");
const Place = require("../models/place");
const { placeSchema } = require("../schemas/place");
const ErrorHandler = require("../utils/ErrorHandler");
const wrapAsync = require("../utils/wrapAsync");
const isValidObjectId = require("../middleware/isValidObjectId");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

const validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(", ");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const places = await Place.find();
    console.log(places);
    res.render("places/index", { places });
  })
);

router.get("/new", isAuth, (req, res) => {
  res.render("places/create");
});

router.post(
  "/",
  isAuth,
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = new Place(req.body.place);
    console.log(req.body);
    await place.save();
    req.flash("successMsg", "Place saved successfully");
    res.redirect("/places");
  })
);

router.get(
  "/:id",
  isValidObjectId("/places"),
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id).populate("reviews");
    res.render("places/show", { place });
  })
);

router.get(
  "/:id/edit",
  isAuth,
  isValidObjectId("/places"),
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render("places/edit", { place });
  })
);

router.put(
  "/:id",
  isAuth,
  isValidObjectId("/places"),
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = await Place.findByIdAndUpdate(req.params.id, {
      ...req.body.place,
    });
    req.flash("successMsg", "Place updated successfully");
    res.redirect(`/places/${place._id}`);
  })
);

router.delete(
  "/:id",
  isAuth,
  isValidObjectId("/places"),
  wrapAsync(async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    req.flash("successMsg", "Place deleted successfully");
    res.redirect("/places");
  })
);

module.exports = router;
