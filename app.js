const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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
