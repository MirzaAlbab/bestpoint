const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: Number,
  comment: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User", // Assuming User is the model name for user data
  },
});

module.exports = mongoose.model("Review", reviewSchema);
