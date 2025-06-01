const orderModel = require("../models/order.model");
const sendEmail = require("../utils/sendEmail");
const payoutRequestNotificationToAdminTemplate = require("../utils/emailTemplates/payoutRequestNotificationToAdminTemplate");
const payoutNotificationToSellerTemplate = require("../utils/emailTemplates/payoutNotificationToSellerTemplate");
const payoutNotificationToBuyerTemplate = require("../utils/emailTemplates/payoutNotificationToBuyerTemplate");

const handleBookDelivered = async (req, res) => {
  const { trackingId } = req.body;

  // Check if trackingId is provided
  if (!trackingId || trackingId.trim() === "") {
    return res.status(400).json({ message: "Tracking ID is required." });
  }

  try {
    const order = await orderModel
      .findOne({ "tracking.trackingId": trackingId })
      .populate("bookId sellerId buyerId");

    console.log("order : ", order);

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found for the provided trackingId." });
    }

    if (order.status === "delivered") {
      return res.status(400).json({
        message: "Already processsed the order",
      });
    }

    order.status = "delivered";
    await order.save();

    // Send email to the buyer
    await sendEmail({
      to: order.buyerId.email,
      subject: `Your Order for ${order.bookId.title} has been Delivered`,
      text: `Your Order for ${order.bookId.title} has been Delivered`,
      html: payoutNotificationToBuyerTemplate(
        order.buyerId.firstName + order.buyerId.lastName,
        order.bookId.title,
        order._id
      ),
    });

    // Send email to the seller
    await sendEmail({
      to: order.sellerId.email,
      subject: `Payout Notification for Order: ${order._id}`,
      text: `Payout Notification for Order: ${order._id}`,
      html: payoutNotificationToSellerTemplate(
        order.sellerId.firstName + order.sellerId.lastName,
        order.bookId.title,
        order._id,
        order.payout.method,
        order.bookId.price
      ),
    });

    // Send email to admin about payout details
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `Payout Request Notification for Order: ${order._id}`,
      text: `Payout Request Notification for Order: ${order._id}`,
      html: payoutRequestNotificationToAdminTemplate(
        order._id,
        trackingId,
        order.sellerId.firstName + order.sellerId.lastName,
        order.payout.method,
        order.payout.upi,
        order.payout.accountNumber,
        order.payout.ifsc
      ),
    });

    // Respond with success
    res.status(200).json({
      message: "Order marked as delivered and emails sent successfully.",
    });
  } catch (error) {
    console.error("Error in handling delivery:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = {
  handleBookDelivered,
};
