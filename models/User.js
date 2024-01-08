const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        default: 1500.0,
      },
      contestsCount: {
        type: Number,
        default: 0,
      },
      region: {
        type: String,
        default: "US",
      }
});

module.exports = User = mongoose.model("users", UserSchema);
