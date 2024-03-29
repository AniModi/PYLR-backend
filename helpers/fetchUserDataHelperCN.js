const User = require("../models/User");
const axios = require("axios");

const url = process.env.LEETCODE_GRAPHQL_BASE_URL_CN;
const batchSize = 10;
const timeoutBetweenBatches = 1000;
async function updateUserData(username, rating, contestsCount) {
  try {
    const user = await User.findOne({ username });

    if (user) {
      user.rating = rating;
      user.contestsCount = contestsCount;
      await user.save();
    } else {
      await User.create({
        username,
        rating,
        contestsCount,
        region: "CN",
      });
    }
  } catch (error) {
    console.error(`Error updating user data: ${error}`);
  }
}

async function fetchUserDetailsBatch(usernames) {
  const maxRetries = 3;
  const retryDelay = 100;
  const promises = usernames.map(async (username) => {
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const query = `
          query userContestRankingInfo($username: String!) {
            userContestRanking(userSlug: $username) {
              attendedContestsCount
              rating
            }
          }
        `;

        const response = await axios.post(url, {
          query,
          variables: { username },
        });

        const { rating, attendedContestsCount } =
          response.data.data.userContestRanking || {};

        await updateUserData(
          username,
          rating !== null ? rating : 1500,
          attendedContestsCount !== null ? attendedContestsCount : 0
        );

        break;
      } catch (err) {
        console.error(`Failed to fetch user details for ${username}: ${err}`);
        retryCount++;

        if (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }
  });

  await Promise.all(promises);
}

async function fetchUserDataHelperCN(usernames) {
  try {
    for (let i = 0; i < usernames.length; i += batchSize) {
      const batchUsernames = usernames.slice(i, i + batchSize);
      await fetchUserDetailsBatch(batchUsernames);

      if (i + batchSize < usernames.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, timeoutBetweenBatches)
        );
      }
      console.log(i);
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  fetchUserDataHelperCN,
};
