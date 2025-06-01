const analyticsModel = require("../models/analytics.model");

// Increment views count
exports.updateViews = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!bookId || bookId.trim() === "") {
      return res.status(400).json({
        message: "bookId is required",
      });
    }

    // Find or create the analytics entry
    const analytics = await analyticsModel.findOneAndUpdate(
      { bookId },
      { $inc: { views: 1 }, $set: { lastUpdated: new Date() } },
      { new: true, upsert: true } // Create if not found
    );

    res.status(200).json(analytics);
  } catch (err) {
    res.status(500).json({ message: "Error updating views count", error: err });
  }
};

// Increment added-to-cart count
exports.updateCart = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Find or create the analytics entry
    const analytics = await analyticsModel.findOneAndUpdate(
      { bookId },
      { $inc: { addedToCart: 1 }, $set: { lastUpdated: new Date() } },
      { new: true, upsert: true } // Create if not found
    );

    res.status(200).json(analytics);
  } catch (err) {
    res.status(500).json({ message: "Error updating cart count", error: err });
  }
};

// Increment wishlisted count
exports.updateWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Find or create the analytics entry
    const analytics = await analyticsModel.findOneAndUpdate(
      { bookId },
      { $inc: { wishlisted: 1 }, $set: { lastUpdated: new Date() } },
      { new: true, upsert: true } // Create if not found
    );

    res.status(200).json(analytics);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating wishlist count", error: err });
  }
};

// Increment attempted purchases count
exports.updateAttemptedPurchase = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Find or create the analytics entry
    const analytics = await analyticsModel.findOneAndUpdate(
      { bookId },
      { $inc: { attemptedPurchases: 1 }, $set: { lastUpdated: new Date() } },
      { new: true, upsert: true } // Create if not found
    );

    res.status(200).json(analytics);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating attempted purchase count", error: err });
  }
};
