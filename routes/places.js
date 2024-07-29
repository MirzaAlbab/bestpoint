const express = require("express");
const Place = require("../models/place");
const { placeSchema } = require("../schemas/place");
const ErrorHandler = require("../utils/ErrorHandler");
const wrapAsync = require("../utils/wrapAsync");

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

router.get("/new", (req, res) => {
  res.render("places/create");
});

router.post(
  "/",
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = new Place(req.body.place);
    console.log(req.body);
    await place.save();
    res.redirect("/places");
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id).populate("reviews");
    res.render("places/show", { place });
  })
);

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render("places/edit", { place });
  })
);

router.put(
  "/:id",
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = await Place.findByIdAndUpdate(req.params.id, {
      ...req.body.place,
    });
    res.redirect(`/places/${place._id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    res.redirect("/places");
  })
);

module.exports = router;
