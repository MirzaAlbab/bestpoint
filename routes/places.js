const express = require("express");
const Place = require("../models/place");
const { placeSchema } = require("../schemas/place");
const ErrorHandler = require("../utils/ErrorHandler");
const wrapAsync = require("../utils/wrapAsync");
const isValidObjectId = require("../middleware/isValidObjectId");
const isAuth = require("../middleware/isAuth");
const { isAuthorPlace } = require("../middleware/isAuthor");
const PlaceController = require("../controllers/place");

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
router
  .route("/")
  .get(wrapAsync(PlaceController.index))
  .post(isAuth, validatePlace, wrapAsync(PlaceController.store));

router.get("/new", isAuth, PlaceController.create);

router
  .route("/:id")
  .get(isValidObjectId("/places"), wrapAsync(PlaceController.show))
  .put(
    isAuth,
    isAuthorPlace,
    isValidObjectId("/places"),
    validatePlace,
    wrapAsync(PlaceController.update)
  )
  .delete(
    isAuth,
    isAuthorPlace,
    isValidObjectId("/places"),
    wrapAsync(PlaceController.destroy)
  );

router.get(
  "/:id/edit",
  isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  wrapAsync(PlaceController.edit)
);

module.exports = router;
