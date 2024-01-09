const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PredictedUserRatingSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  delta: {
    type: Number,
    default: 0,
  },
});

const PredictedUserRatings = mongoose.model(
  "predicted",
  PredictedUserRatingSchema
);

module.exports = PredictedUserRatings;