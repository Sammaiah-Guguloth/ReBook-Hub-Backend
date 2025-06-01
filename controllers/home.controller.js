const analyticsModel = require("../models/analytics.model");
const bookModel = require("../models/book.model");

exports.getHomePageData = async (req, res) => {
  try {
    // 1. Get top 5 trending genres by score
    let trendingGenresData = await analyticsModel.aggregate([
      {
        $group: {
          _id: "$genre",
          views: { $sum: "$views" },
          wishlisted: { $sum: "$wishlisted" },
          attemptedPurchases: { $sum: "$attemptedPurchases" },
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$views", 1] },
              { $multiply: ["$wishlisted", 0.6] },
              { $multiply: ["$attemptedPurchases", 0.4] },
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 5 },
    ]);

    // Extract genre names from aggregation result
    let trendingGenres = trendingGenresData.map((g) => g._id).filter(Boolean); // remove null or undefined genres

    // Fallback genres if no trending genres found
    if (!trendingGenres.length) {
      trendingGenres = [
        "Romance",
        "Self-help",
        "Education",
        "Mystery",
        "Fantasy",
      ];
    }

    // 2. For each genre, find top 7 books
    const trendingData = await Promise.all(
      trendingGenres.map(async (genre) => {
        const books = await bookModel
          .find({ genre })
          .sort({
            views: -1,
            wishlistCount: -1,
            paymentCount: -1,
          })
          .limit(7);

        return {
          genre,
          books,
        };
      })
    );

    // 3. Recent Books (limit 10)
    const recentBooks = await bookModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(10);

    // 4. Popular Books from analytics model (top 10 bookIds)
    const popularAnalytics = await analyticsModel
      .find()
      .sort({ views: -1, wishlistCount: -1, paymentCount: -1 })
      .limit(10);

    const bookIds = popularAnalytics.map((a) => a.bookId);

    let popularBooks = await bookModel.find({
      _id: { $in: bookIds },
    });

    // Reorder to match analytics score order
    const bookMap = new Map(popularBooks.map((b) => [b._id.toString(), b]));
    popularBooks = bookIds
      .map((id) => bookMap.get(id.toString()))
      .filter(Boolean);

    // 5. Return final response
    res.json({
      trendingGenres: trendingData,
      recentBooks,
      popularBooks,
    });
  } catch (error) {
    console.error("Error in getHomePageData:", error);
    res.status(500).json({
      message: "Error fetching homepage data",
      error: error.message || error,
    });
  }
};
