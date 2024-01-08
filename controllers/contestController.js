const { fetchRankHelper } = require("../helpers/fetchRankHelperUS");
const { fetchRankHelperCN } = require("../helpers/fetchRankHelperCN");
const Contest = require("../models/Contest");
const MergedContest = require("../models/MergedContest");

async function fetchContestData(req, res) {
  try {
    const { contestID } = req.body;

    await fetchRankHelper(contestID);
    await fetchRankHelperCN(contestID);

    res.json({ message: "Successfully fetched" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
}

async function mergeContestData(req, res) {
  try {
    const { contestID } = req.body;
    const data = await Contest.find({ contestID });
    data.sort((a, b) => {
      if (a.score == b.score) {
        return a.finishTime - b.finishTime;
      }
      return b.score - a.score;
    });

    const bulkOps = data.map(({ username }, index) => ({
      updateOne: {
        filter: { contestID, username },
        update: { $set: { contestID, username, ranking: index } },
        upsert: true,
      },
    }));

    const mergedData = await MergedContest.bulkWrite(bulkOps);
    res.json({
      message : "Successfully merged ranks",
      mergedData
    })
  } catch (err) {
    res.status(500).json({
      message: "Failed to merge ranks of both regions",
      error: err,
    });
  }
}

module.exports = {
  fetchContestData,
  mergeContestData,
};
