const shipmentModel = require("../models/shipment.model");

// to add mock shipment data
exports.addMockShipment = async (req, res) => {
  try {
    const {
      trackingId,
      slug,
      courier,
      status,
      checkpoints,
      estimatedDelivery,
    } = req.body;

    if (!trackingId || !slug || !courier || !status || !checkpoints) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newShipment = new shipmentModel({
      trackingId,
      slug,
      courier,
      status,
      estimatedDelivery,
      checkpoints,
    });

    await newShipment.save();

    res.status(201).json({
      message: "Mock shipment added successfully",
      shipment: newShipment,
    });
  } catch (error) {
    console.error("Error adding mock shipment:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// to update shipment status (shipped, in transit, etc.)
exports.updateShipmentStatus = async (req, res) => {
  const { trackingId, status } = req.body;

  try {
    // Fetch the shipment from the database using trackingId
    const shipment = await shipmentModel.findOne({ trackingId });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    shipment.status = status;

    // // Push a checkpoint to log the status change with only a message
    // shipment.checkpoints.push({
    //   message: `Status updated to ${status}`,
    //   location: "System Update",
    //   status: status,
    //   time: new Date(),
    // });

    // Save the updated shipment data to the database
    await shipment.save();

    return res.status(200).json({
      message: `Shipment status updated to ${status}`,
      shipment,
    });
  } catch (err) {
    console.error("Error updating shipment status:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// to update shipment (with location and message)
exports.updateShipment = async (req, res) => {
  const { trackingId, message, location = null } = req.body;

  try {
    // Fetch the shipment from the database using trackingId
    const shipment = await shipmentModel.findOne({ trackingId });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    // Add a checkpoint with location and message (if location is provided)
    if (location) {
      shipment.checkpoints.push({
        message,
        location,
        time: new Date(),
      });
    } else {
      //   // If no location, only add the message to the checkpoints
      //   shipment.checkpoints.push({
      //     message,
      //     location: "System Update",  // Default location
      //     status: shipment.status,
      //     time: new Date(),
      //   });
      shipment.checkpoints[shipment.checkpoints.length - 1].message = message;
    }

    // Save the updated shipment data
    await shipment.save();

    return res.status(200).json({
      message: "Shipment updated successfully",
      shipment,
    });
  } catch (err) {
    console.error("Error updating shipment:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get shipment by tracking ID
exports.getShipmentByTrackingId = async (req, res) => {
  const { trackingId } = req.params;

  try {
    // Find the shipment by trackingId
    const shipment = await shipmentModel.findOne({ trackingId });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    return res.status(200).json({
      message: "Shipment retrieved successfully",
      shipment,
    });
  } catch (error) {
    console.error("Error fetching shipment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
