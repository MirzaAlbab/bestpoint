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
      const registerUser = await User.register(user, password);
      req.login(registerUser, (err) => {
        if (err) return next(err);
        req.flash("successMsg", "User registered and logged successfully");
        res.redirect("/places");
      });
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

router.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("successMsg", "Logged out successfully");
    res.redirect("/login");
  });
});

module.exports = router;
