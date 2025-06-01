const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orders.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/order-by-id/:orderId", ordersController.getOrderById);
router.post("/accept-order", ordersController.acceptOrder);
router.post("/reject", ordersController.rejectAndRefund);
router.post("/order-shipped", ordersController.orderShipped);
router.get(
  "/orders-by-buyer/:userId",
  authMiddleware.authUser,
  ordersController.getOrdersByBuyerId
);
router.get("/sold-orders/:userId", ordersController.getSoldOrders);


module.exports = router;
