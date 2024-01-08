const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MergedContestSchema = new Schema({
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
});

const MergedContest = mongoose.model("merged-contest-ranking", MergedContestSchema);

module.exports = MergedContest;
