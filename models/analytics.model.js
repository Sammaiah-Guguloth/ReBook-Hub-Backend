const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book",
    required: true,
    unique: true,
  },
  genre: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  addedToCart: {
    type: Number,
    default: 0,
  },
  wishlisted: {
    type: Number,
    default: 0,
  },
  attemptedPurchases: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const analyticsModel = mongoose.model("analytics", analyticsSchema);
module.exports = analyticsModel;
