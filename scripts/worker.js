const memo = {};

function f(k) {
  function g(k) {
    if (k in memo) {
      return memo[k];
    }

    if (k >= 1) {
      const result = (5 / 7) ** k + g(k - 1);
      memo[k] = result;
      return result;
    }

    return 1;
  }

  if (k <= 100) {
    return 1 / (1 + g(k));
  }

  return 2 / 9;
}

function getEstimatedRating(rating, ratings) {
  const func = (a, b) => {
    const x = 1 + 10 ** ((a - b) / 400);
    return 1 / x;
  };
  let ans = 0;
  for (let i = 0; i < ratings.length; i++) {
    ans += func(rating, ratings[i]);
  }
  return ans;
}

function getEstimatedRank(estimatedRating, rank) {
  return Math.sqrt(rank * estimatedRating);
}

function binary_search_rating(m, ratings) {
  let estimate = m - 0.5;
  let low = 0,
    high = 4000; // max rating will not be 4k (as of now)
  let precision = 0.01;
  let max_iterations = 25;
  while (high - low > precision && max_iterations >= 0) {
    var mid = low + (high - low) / 2;
    if (getEstimatedRating(mid, ratings) < estimate) {
      high = mid;
    } else {
      low = mid;
    }
    max_iterations--;
  }
  return mid;
}
const { workerData, parentPort } = require("worker_threads");

async function processBatch(
  startIndex,
  endIndex,
  ratings,
  counts,
  sortedUsernames,
  contestID
) {
  const bulkOps = [];
  for (let user = startIndex; user < endIndex; user++) {
    let initialGuess = getEstimatedRating(ratings[user], ratings);
    let m = getEstimatedRank(initialGuess, user + 1);
    const estimatedRating = binary_search_rating(m, ratings);
    const change = (estimatedRating - ratings[user]) * f(counts[user]);

    const updateOperation = {
      updateOne: {
        filter: { username: sortedUsernames[user] },
        update: { $set: { delta: change, contestID: contestID } },
        upsert: true,
      },
    };

    bulkOps.push(updateOperation);
  }

  parentPort.postMessage({ bulkOps });
}

processBatch(...workerData);
