const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get(/register/, (req, res) => {
  res.render("auth/register");
});

router.post(
  "/register",
  wrapAsync(async (req, res) => {
    // Save user to database
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      await User.register(user, password);
      req.flash("successMsg", "User registered");
      res.redirect("/login");
    } catch (error) {
      req.flash("errorMsg", error.message);
      res.redirect("/register");
    }
  })
);

router.get(/login/, (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: {
      type: "errorMsg",
      message: "Invalid username or password",
    },
  }),
  (req, res) => {
    req.flash("successMsg", "Logged in successfully");
    res.redirect("/places");
  }
);

module.exports = router;
