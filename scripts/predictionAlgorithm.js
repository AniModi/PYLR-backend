const PredictedUserRatings = require("../models/PredictedRatings");
const os = require("os");
const cpuCount = os.cpus().length - 1;

async function getPredictedRatings(
  ratings,
  counts,
  sortedUsernames,
  contestID
) {
  const totalUsers = sortedUsernames.length;
  const batchSize = totalUsers / cpuCount;
  const { Worker } = require("worker_threads");
  const path = require("path");
  const workerPath = path.resolve(__dirname, "worker.js");

  const workers = [];

  for (let i = 0; i < totalUsers; i += batchSize) {
    const endIndex = Math.min(i + batchSize, totalUsers);
    const worker = new Worker(workerPath, {
      workerData: [i, endIndex, ratings, counts, sortedUsernames, contestID],
    });
    workers.push(
      new Promise((res) => {
        worker.on("message", async (e) => {
          const bulkOps = e.bulkOps;
          await PredictedUserRatings.bulkWrite(bulkOps);
          res();
        });
      })
    );
  }
  await Promise.all(workers);
}

module.exports = {
  getPredictedRatings,
};
