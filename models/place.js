const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  images: String,
});

module.exports = mongoose.model("Place", placeSchema);
