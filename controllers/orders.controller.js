const orderModel = require("../models/order.model");
const bookModel = require("../models/book.model");
const sendEmail = require("../utils/sendEmail");
const orderAcceptedNotificationToBuyerTemplate = require("../utils/emailTemplates/orderAcceptedNotificationToBuyerTemplate");
const orderConfirmedShippingFormTemplate = require("../utils/emailTemplates/orderConfirmedShippingFormTemplate");
const orderRejectedNotificationToBuyerTemplate = require("../utils/emailTemplates/orderRejectedNotificationToBuyerTemplate");
const orderRejectedNotificationToSellerTemplate = require("../utils/emailTemplates/orderRejectedNotificationToSellerTemplate");
const Razorpay = require("razorpay");
const orderShippedNotificationTemplate = require("../utils/emailTemplates/orderShippedNotificationTemplate");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// get the order by Id
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params?.orderId;
    if (!orderId) {
      return res.status(400).json({
        message: "Order Id required",
      });
    }

    const order = await orderModel
      .findById(orderId)
      .populate("bookId")
      .populate("buyerId")
      .populate("sellerId");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order Fetched successfully",
      order,
    });
  } catch (error) {
    console.log("Error while fetching order by Id : ", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const acceptOrder = async (req, res) => {
  try {
    const {
      orderId,
      payoutMethod,
      payoutName,
      payoutUpi,
      payoutAccountNumber,
      payoutIfsc,
      payoutContactId,
    } = req.body;

    // Validate method
    if (!["upi", "bank"].includes(payoutMethod)) {
      return res.status(400).json({ message: "Invalid payout method" });
    }

    // Validate required fields
    if (!payoutName || !payoutContactId) {
      return res
        .status(400)
        .json({ message: "Missing required payout fields" });
    }

    if (payoutMethod === "upi" && !payoutUpi) {
      return res
        .status(400)
        .json({ message: "UPI ID is required for UPI method" });
    }

    if (payoutMethod === "bank" && (!payoutAccountNumber || !payoutIfsc)) {
      return res.status(400).json({
        message: "Account number and IFSC code are required for bank method",
      });
    }

    // Fetch the order
    const order = await orderModel
      .findById(orderId)
      .populate("bookId")
      .populate("buyerId")
      .populate("sellerId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending_seller_confirmation") {
      return res
        .status(400)
        .json({ message: "Order already processed or cancelled" });
    }

    // Save payout details
    order.payout = {
      method: payoutMethod,
      name: payoutName,
      upi: payoutMethod === "upi" ? payoutUpi : undefined,
      accountNumber: payoutMethod === "bank" ? payoutAccountNumber : undefined,
      ifsc: payoutMethod === "bank" ? payoutIfsc : undefined,
      contactId: payoutContactId,
    };

    order.status = "seller_accepted";

    await order.save();

    // Send emails
    await sendEmail({
      to: order.sellerId.email,
      subject: "Order Accepted",
      text: `You have accepted the order ${order._id}. Please ship the order and provide tracking details.`,
      html: orderConfirmedShippingFormTemplate(
        order.sellerId.firstName + order.sellerId.lastName,
        order.bookId.title,
        orderId
      ),
    });

    await sendEmail({
      to: order.buyerId.email,
      subject: "Order Accepted",
      text: `Your order ${order._id} has been accepted by the seller. Track your order once it's shipped.`,
      html: orderAcceptedNotificationToBuyerTemplate(
        order.buyer.name,
        order.bookId.title,
        orderId
      ),
    });

    return res.status(200).json({
      message: "Order accepted and payout details saved.",
      order,
    });
  } catch (error) {
    console.error("Error accepting order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reject and refund

const rejectAndRefund = async (req, res) => {
  try {
    const { orderId } = req.body;

    // 1. Find and populate the order along with book, buyer, and seller details
    const order = await orderModel
      .findById(orderId)
      .populate("bookId", "title")
      .populate("buyerId", "name email")
      .populate("sellerId", "name email");

    // console.log(order);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "pending_seller_confirmation") {
      return res
        .status(400)
        .json({ message: "Refund not allowed in current status" });
    }

    // 2. Mark as rejected ( cancelled)
    order.status = "rejected";
    await order.save();

    // 3. Extract populated data
    const { title: bookTitle } = order.bookId;
    const { name: buyerName, email: buyerEmail } = order.buyerId;
    const { name: sellerName, email: sellerEmail } = order.sellerId;

    // console.log("chame here");

    // 4. Attempt refund via Razorpay
    const refund = await razorpayInstance.payments.refund(
      order.razorpayPaymentId
    );

    // 5. Mark as refunded once refund is successful
    order.status = "refunded";
    await order.save();

    const book = await bookModel.findById(order.bookId);

    book.isAvailable = true;

    await book.save();

    // 6. Notify buyer
    await sendEmail({
      to: buyerEmail,
      subject: "Refund Initiated - ReBook Hub",
      text: `Your order for '${bookTitle}' has been rejected and refund has been initiated.`,
      html: orderRejectedNotificationToBuyerTemplate(
        buyerName,
        bookTitle,
        order._id
      ),
    });

    // 7. Notify seller
    await sendEmail({
      to: sellerEmail,
      subject: "Order Rejected & Refund Initiated - ReBook Hub",
      text: `The order for '${bookTitle}' has been rejected and refund to the buyer has been initiated.`,
      html: orderRejectedNotificationToSellerTemplate(
        sellerName,
        bookTitle,
        order._id
      ),
    });

    res.status(200).json({
      message: "Order rejected and refund initiated. Emails sent.",
      refund,
    });
  } catch (error) {
    console.error("Refund Error:", error);

    // Leave status as 'rejected', cron job will retry refund later
    res.status(500).json({
      message:
        "Order rejected. Refund initiation failed. Cron will retry later.",
      error: error.message,
    });
  }
};

// order shipped
const orderShipped = async (req, res) => {
  const { orderId, trackingId, courier } = req.body;

  if (!orderId || !trackingId || !courier) {
    return res.status(400).json({
      message: "OrderId , trackingId and courier are required",
    });
  }

  try {
    const order = await orderModel
      .findById(orderId)
      .populate("buyerId sellerId bookId");
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = "shipped";
    order.tracking = {
      trackingId,
      courier,
    };

    await order.save();

    // Send email to buyer
    await sendEmail({
      to: order.buyerId.email,
      subject: `Your Order for ${order.bookId.title} has been shipped`,
      text: `Your Order for ${order.bookId.title} has been shipped`,
      html: orderShippedNotificationTemplate(
        order.buyerId.firstName + "  " + order.buyerId.lastName,
        order.bookId.title,
        trackingId
      ),
    });

    return res.status(200).json({
      message: "Order shipped successfully",
      order,
    });
  } catch (error) {
    console.error("Error while shipping order : ", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// get orders of a user(buyer) by userId
const getOrdersByBuyerId = async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({
      message: "User Id required",
    });
  }
  try {
    const orders = await orderModel
      .find({ buyerId: userId })
      .populate("bookId")
      .populate("sellerId");

    if (!orders) {
      return res.status(404).json({
        message: "Orders not found",
      });
    }

    return res.status(200).json({
      message: "Orders Fetched successfully",
      orders,
    });
  } catch (error) {
    console.log("Error while fetching orders by user Id : ", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// get sold books by seller id
const getSoldOrders = async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({
      message: "User Id required",
    });
  }
  try {
    const orders = await orderModel
      .find({ sellerId: userId })
      .populate("bookId")
      .populate("sellerId")
      .populate("buyerId");

    if (!orders) {
      return res.status(404).json({
        message: "Orders not found",
      });
    }

    return res.status(200).json({
      message: "Orders(sold Books) Fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(
      "Error while fetching orders (sold books) by user Id : ",
      error
    );
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getOrderById,
  acceptOrder,
  acceptOrder,
  rejectAndRefund,
  orderShipped,
  getOrdersByBuyerId,
  getSoldOrders,
};
