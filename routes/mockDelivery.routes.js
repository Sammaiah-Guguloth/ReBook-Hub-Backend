const express = require("express");
const router = express.Router();

const mockDeliveryController = require("../controllers/mockDelivery.controller");

// add mock shipment
router.post("/add-shipment", mockDeliveryController.addMockShipment);

// update shipment status
router.post(
  "/update-shipment-status",
  mockDeliveryController.updateShipmentStatus
);

// update shipment
router.post("/update-shipment", mockDeliveryController.updateShipment);

// get shipment
router.get(
  "/track-order/:trackingId",
  mockDeliveryController.getShipmentByTrackingId
);

module.exports = router;
