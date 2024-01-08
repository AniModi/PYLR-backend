const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContestSchema = new Schema({
  contestID: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  ranking: {
    type: Number,
    required: true,
  },
  region: {
    type: String,
    default: "US",
  },
  score: {
    type: Number,
    default: 0
  },
  finishTime: {
    type: Number,
  }
});

const Contests = mongoose.model("contests", ContestSchema);

module.exports = Contests;
