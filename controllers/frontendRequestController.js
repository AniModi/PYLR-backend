const Contests = require("../models/Contest");
const PredictedUserRatings = require("../models/PredictedRatings");
async function fetchRanking(req, res) {
  try {
    const { contestID, page } = req.params;
    const min = (page - 1) * 25 + 1;
    const max = min + 24;
    const contest = await Contests.find({
      contestID: contestID,
      ranking: { $gte: min, $lte: max },
    });
    contest.sort((a, b) => a.ranking - b.ranking);
    res.json({ contest, min, max });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch rank",
      error: err,
    });
  }
}

async function getMaxPages(req, res) {
  try {
    const { contestID } = req.params;
    const contest = await Contests.find({ contestID: contestID, region: "US" });
    const number_of_pages = Math.ceil(contest.length / 25);
    res.json({ user_count: contest.length, number_of_pages });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch number of pages",
      error: err,
    });
  }
}

async function fetchPredictedRating(req, res) {
  try {
    const { usernames, contestID } = req.body;

    const ratings = await PredictedUserRatings.find({
      username: { $in: usernames },
      contestID: contestID,
    });

    res.json({ ratings: ratings });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch rating from database",
      error: err,
    });
  }
}

module.exports = {
  fetchRanking,
  getMaxPages,
  fetchPredictedRating,
};
