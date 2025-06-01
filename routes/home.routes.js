const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.controller");

// GET /home/data - Fetches homepage data like trending categories, recent books, popular books
router.get("/default-feed", homeController.getHomePageData);

module.exports = router;
