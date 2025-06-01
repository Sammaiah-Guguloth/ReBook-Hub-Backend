const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true, // Unique tracking ID for each shipment
    },
    slug: {
      type: String,
      required: true,
    }, // e.g., "delhivery", "india-post"
    courier: {
      type: String,
      required: true,
    }, // e.g., "India Post"
    status: {
      type: String,
      enum: [
        "InTransit",
        "OutForDelivery",
        "Delivered",
        "Exception",
        "FailedAttempt",
      ],
      default: "InTransit",
    },
    estimatedDelivery: {
      type: Date,
    },
    checkpoints: [
      {
        message: { type: String, required: true },
        location: { type: String, required: true },
        time: {
          type: Date,
          required: true,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const shipmentModel = mongoose.model("shipment", shipmentSchema);
module.exports = shipmentModel;
