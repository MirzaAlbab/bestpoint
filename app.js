const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ErrorHandler = require("./utils/ErrorHandler");

// connect mongodb
mongoose
  .connect("mongodb://127.0.0.1/bestpoints")
  .then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB: ", err);
  });

// models
const Place = require("./models/place");
const Review = require("./models/review");

// schemas
const { placeSchema } = require("./schemas/place");
const { reviewSchema } = require("./schemas/review");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validatePlace = (req, res, next) => {
  console.log(req.body);
  const { error } = placeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(", ");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  console.log(req.body);
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(", ");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/places",
  wrapAsync(async (req, res) => {
    const places = await Place.find();
    console.log(places);
    res.render("places/index", { places });
  })
);

app.get("/places/new", (req, res) => {
  res.render("places/create");
});

app.post(
  "/places",
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = new Place(req.body.place);
    console.log(req.body);
    await place.save();
    res.redirect("/places");
  })
);

app.get(
  "/places/:id",
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id).populate("reviews");
    res.render("places/show", { place });
  })
);

app.get(
  "/places/:id/edit",
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render("places/edit", { place });
  })
);

app.put(
  "/places/:id",
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = await Place.findByIdAndUpdate(req.params.id, {
      ...req.body.place,
    });
    res.redirect(`/places/${place._id}`);
  })
);

app.delete(
  "/places/:id",
  wrapAsync(async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    res.redirect("/places");
  })
);
app.post(
  "/places/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    const review = new Review(req.body.review);
    const place = await Place.findById(req.params.id);
    place.reviews.push(review);
    await review.save();
    await place.save();
    res.redirect(`/places/${req.params.id}`);
  })
);

app.delete(
  "/places/:place_id/reviews/:review_id",
  wrapAsync(async (req, res) => {
    const { place_id, review_id } = req.params;
    await Place.findByIdAndUpdate(place_id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    res.redirect(`/places/${place_id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ErrorHandler());
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no! Something went wrong";
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
