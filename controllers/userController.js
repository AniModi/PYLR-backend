const Contest = require("../models/Contest");
const { fetchUserDataHelper } = require("../helpers/fetchUserDataHelper");
const { fetchUserDataHelperCN } = require("../helpers/fetchUserDataHelperCN");

async function updateAllUsers(req, res) {
  try {
    const usernames = await fetchAllUsernames();

    await fetchUserDataHelperCN(usernames.cnUsernames),
    await fetchUserDataHelper(usernames.usUsernames),
    
    res.json({ message: "Successfully updated the users" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to update user details",
      error: err,
    });
  }
}

async function fetchAllUsernames() {
  try {
    const distinctUsernamesAndRegions = await Contest.find();
    const usUsernamesSet = new Set();
    const cnUsernamesSet = new Set();

    distinctUsernamesAndRegions.forEach(({ username, region }) => {
      if (region === "US") {
        usUsernamesSet.add(username);
      } else if (region === "CN") {
        cnUsernamesSet.add(username);
      }
    });

    const usUsernames = Array.from(usUsernamesSet);
    const cnUsernames = Array.from(cnUsernamesSet);

    return { usUsernames, cnUsernames };
  } catch (error) {
    console.error(`Error fetching usernames: ${error}`);
    return { usUsernames: [], cnUsernames: [] };
  }
}

module.exports = {
  updateAllUsers,
};
