const MergedContest = require("../models/MergedContest");
const PredictedUserRatings = require("../models/PredictedRatings");
const User = require("../models/User");
const { getPredictedRatings } = require("../scripts/predictionAlgorithm");

async function fetchAllUsernames(contestID) {
  try {
    const distinctUsernames = await MergedContest.find({ contestID });
    return distinctUsernames;
  } catch (error) {
    console.error(`Error fetching usernames: ${error}`);
    return [];
  }
}

async function sortUsernamesByRanking(data) {
  return data
    .sort((a, b) => a.ranking - b.ranking)
    .map((user) => user.username);
}

async function fetchUserDataBatch(usernames) {
  return await User.find({ username: { $in: usernames } });
}

async function fetchData(sortedUsernames) {
  const batchSize = 500;
  let offset = 0;
  let allUserData = [];

  while (offset < sortedUsernames.length) {
    const batchUsernames = sortedUsernames.slice(offset, offset + batchSize);
    const userDataBatch = await fetchUserDataBatch(batchUsernames);
    const orderedUserDataBatch = batchUsernames.map((username) =>
      userDataBatch.find((user) => user.username === username)
    );

    allUserData = allUserData.concat(orderedUserDataBatch);
    offset += batchSize;
  }

  const contestCounts = allUserData.map((user) => user.contestsCount);
  const ratings = allUserData.map((user) => user.rating);

  return [ratings, contestCounts];
}

async function predictRating(req, res) {
  try {
    const { contestID } = req.body;

    const data = (await fetchAllUsernames(contestID)).map((user) => ({
      username: user.username,
      ranking: user.ranking,
    }));

    const sortedUsernames = await sortUsernamesByRanking(data);

    const response = await fetchData(sortedUsernames);

    await getPredictedRatings(response[0], response[1], sortedUsernames);

    res.json({
      message: "Ratings predicted successfully!",
    });
  } catch (err) {
    console.error(`Error predicting rating: ${err}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function fetchPredictedRating(req, res) {
  try {
    const { usernames } = req.body;

    const ratings = await PredictedUserRatings.find({
      username: { $in: usernames },
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
  predictRating,
  fetchPredictedRating,
};
