module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("errorMsg", "You must be logged in to access");
    return res.redirect("/login");
  }
  next();
};
