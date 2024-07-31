const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const AuthController = require("../controllers/auth");

router.get(/register/, AuthController.registerForm);

router.post("/register", wrapAsync(AuthController.register));

router.get(/login/, AuthController.loginForm);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: {
      type: "errorMsg",
      message: "Invalid username or password",
    },
  }),
  AuthController.login
);

router.post("/logout", AuthController.logout);

module.exports = router;
