const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
// connect mongodb
mongoose
  .connect("mongodb://127.0.0.1/bestpoints")
  .then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB: ", err);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      maxAge: 60 * 60 * 1000,
    }, // set secure to true for HTTPS
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("successMsg");
  res.locals.errorMsg = req.flash("errorMsg");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/places", require("./routes/places"));
app.use("/places/:place_id/reviews", require("./routes/review"));

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no! Something went wrong";
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
