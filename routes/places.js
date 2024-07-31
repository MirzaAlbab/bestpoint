const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const isValidObjectId = require("../middleware/isValidObjectId");
const isAuth = require("../middleware/isAuth");
const { isAuthorPlace } = require("../middleware/isAuthor");
const PlaceController = require("../controllers/place");
const { validatePlace } = require("../middleware/validator");
const upload = require("../config/multer");

const router = express.Router();

router
  .route("/")
  .get(wrapAsync(PlaceController.index))
  .post(
    isAuth,
    upload.array("image", 5),
    validatePlace,
    wrapAsync(PlaceController.store)
  );

router.get("/new", isAuth, PlaceController.create);

router
  .route("/:id")
  .get(isValidObjectId("/places"), wrapAsync(PlaceController.show))
  .put(
    isAuth,
    isAuthorPlace,
    isValidObjectId("/places"),
    upload.array("image", 5),
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

router.delete(
  "/:id/images",
  isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  PlaceController.destroyImages
);

module.exports = router;
