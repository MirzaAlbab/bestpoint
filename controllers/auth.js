const User = require("../models/user");
module.exports.loginForm = (req, res) => {
  res.render("auth/login");
};

module.exports.registerForm = (req, res) => {
  res.render("auth/register");
};

module.exports.register = async (req, res) => {
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
};

module.exports.login = (req, res) => {
  req.flash("successMsg", "Logged in successfully");
  res.redirect("/places");
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("successMsg", "Logged out successfully");
    res.redirect("/login");
  });
};
