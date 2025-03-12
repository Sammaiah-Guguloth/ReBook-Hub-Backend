const mongoose = require("mongoose");

const blackListTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expiresIn: "24h",
  },
});

const blackListTokenModel = mongoose.model(
  "blackListToken",
  blackListTokenSchema
);

module.exports = blackListTokenModel;
