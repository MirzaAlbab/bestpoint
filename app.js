const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

mongoose
  .connect("mongodb://127.0.0.1/bestpoints")
  .then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB: ", err);
  });

// models
const Place = require("./models/place");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/places", async (req, res) => {
  const places = await Place.find();
  console.log(places);
  res.render("places/index", { places });
});

app.get("/places/new", (req, res) => {
  res.render("places/create");
});

app.post("/places", async (req, res) => {
  const place = new Place(req.body.place);
  console.log(req.body);
  await place.save();
  res.redirect("/places");
});

app.get("/places/:id", async (req, res) => {
  const place = await Place.findById(req.params.id);
  res.render("places/show", { place });
});

app.get("/places/:id/edit", async (req, res) => {
  const place = await Place.findById(req.params.id);
  res.render("places/edit", { place });
});

app.put("/places/:id", async (req, res) => {
  const place = await Place.findByIdAndUpdate(req.params.id, {
    ...req.body.place,
  });
  res.redirect(`/places/${place._id}`);
});

app.delete("/places/:id", async (req, res) => {
  await Place.findByIdAndDelete(req.params.id);
  res.redirect("/places");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
