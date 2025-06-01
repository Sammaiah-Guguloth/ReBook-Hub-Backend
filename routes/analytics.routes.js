const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");

// Increment views count
router.put("/update/views/:bookId", analyticsController.updateViews);

// Increment added-to-cart count
router.put("/update/cart/:bookId", analyticsController.updateCart);

// Increment wishlisted count
router.put("/update/wishlist/:bookId", analyticsController.updateWishlist);

// Increment attempted purchases count
router.put(
  "/update/attempted-purchase/:bookId",
  analyticsController.updateAttemptedPurchase
);

module.exports = router;
