const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const paymentsController = require("../controllers/payments.controller");

router.post(
  "/create-order",
  authMiddleware.authUser,
  paymentsController.createOrder
);

router.post(
  "/verify-payment",
  authMiddleware.authUser,
  paymentsController.verifyPayment
);

module.exports = router;
