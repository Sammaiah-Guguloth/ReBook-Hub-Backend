const express = require("express");
const router = express.Router();

const webhooksController = require("../controllers/webhooks.controller");

// after delivered
router.post("/handle-book-delivered", webhooksController.handleBookDelivered);

module.exports = router;
