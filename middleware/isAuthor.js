const Place = require("../models/place");

module.exports.isAuthorPlace = async (req, res, next) => {
  const { id } = req.params;
  let place = await Place.findById(id);
  if (!place.author.equals(req.user._id)) {
    req.flash("errorMsg", "Unauthorized");
    return res.redirect(`/places`);
  }
  next();
};
