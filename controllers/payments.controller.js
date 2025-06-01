const orderModel = require("../models/order.model");
const bookModel = require("../models/book.model");
const userModel = require("../models/user.model");
const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");
const orderNotificationToSellerTemplate = require("../utils/emailTemplates/orderNotificationToSellerTemplate");
const paymentConfirmationToBuyerTemplate = require("../utils/emailTemplates/paymentConfirmationToBuyerTemplate");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      bookId,
      buyerId,
      sellerId,
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerAddress,
      buyerCity,
      buyerPostal,
    } = req.body;

    // Fetch book and buyer details
    const book = await bookModel.findById(bookId);
    const buyerUser = await userModel.findById(buyerId);

    if (!book || !buyerUser) {
      return res.status(404).json({ message: "Book or Buyer not found" });
    }

    // Create the order
    const newOrder = new orderModel({
      bookId,
      buyerId,
      buyer: {
        name: buyerName,
        email: buyerEmail,
        phone: buyerPhone,
        address: buyerAddress,
        city: buyerCity,
        postal: buyerPostal,
      },
      sellerId,
      status: "pending_payment",
      tracking: {},
    });

    const savedOrder = await newOrder.save();

    // Create a Razorpay order for payment
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: book.price * 100, // Razorpay expects the amount in paise (100 paise = 1 INR)
      currency: "INR",
      receipt: `order_${savedOrder._id}`,
      payment_capture: 1, // Automatically capture payment
    });

    savedOrder.razorpayOrderId = razorpayOrder.id;
    await savedOrder.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
      razorpayOrderId: razorpayOrder.id,
    });
  } catch (error) {
    console.error("Error while creating order:", error);
  }
};

// Handle the payment verification and update order status
const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const razorpaySignature = require("crypto")
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${order.razorpayOrderId}|${paymentId}`)
      .digest("hex");

    if (razorpaySignature === signature) {
      order.razorpayPaymentId = paymentId;
      order.paid = true;
      order.status = "pending_seller_confirmation"; // Payment is done, now seller confirmation

      await order.save();

      // Send a confirmation email to the seller with the order info
      const seller = await userModel.findById(order.sellerId);
      const buyer = await userModel.findById(order.buyerId);
      const book = await bookModel.findById(order.bookId);

      //  // mark the book isAvailability as false
      //  book.isAvailable = false;
      //  await book.save();

      const sellerMessage = `You have received a new order from ${buyer.name}. Order details: ${order._id}`;
      const buyerMessage = `You order has been placed and payment was successfull`;

      await sendEmail({
        to: seller.email,
        subject: "New Order Received",
        text: sellerMessage,
        html: orderNotificationToSellerTemplate(book.title, orderId),
      });
      await sendEmail({
        to: buyer.email,
        subject: "Order placed and payment ,was successfull",
        text: buyerMessage,
        html: paymentConfirmationToBuyerTemplate(book.title, orderId),
      });

      return res.status(200).json({
        message: "Payment verified and order status updated.",
        order,
      });
    } else {
      return res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
  }
};

// release payment after the delivery
const releasePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // 1. Fetch the order
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 2. Ensure payment is completed and seller has accepted
    if (!order.paid || order.status !== "seller_accepted") {
      return res.status(400).json({
        message: "Payment not completed or order not accepted by seller",
      });
    }

    // 3. Check if payout already released
    if (order.payoutReleased) {
      return res.status(400).json({ message: "Payout already released" });
    }

    // 4. Fetch book for payout amount
    const book = await bookModel.findById(order.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const amountInPaise = book.price * 100;

    // 5. Create the payout
    const payout = await razorpayInstance.payouts.create({
      account_number: process.env.RAZORPAY_ACCOUNT_NO, // Your virtual Razorpay account number
      fund_account_id: order.payout.fundAccountId, // Seller's fund account
      amount: amountInPaise,
      currency: "INR",
      mode: order.payout.method === "upi" ? "UPI" : "IMPS",
      purpose: "payout",
      queue_if_low_balance: true,
      reference_id: `order_${order._id}`,
      narration: `Releasing payout for Book ${book._id}`,
    });

    // 6. Update order as payout done
    order.payout.payoutId = payout.id;
    order.payoutReleased = true;
    order.status = "payout_released";
    await order.save();

    // 7. Send confirmation to seller
    await sendEmail(
      order.payout.email || order.sellerId.email,
      "Payout Released",
      `Your payout for order ${order._id} has been successfully released. Razorpay Payout ID: ${payout.id}`
    );

    return res.status(200).json({
      message: "Payout released successfully",
      payoutId: payout.id,
      order,
    });
  } catch (error) {
    console.error("Error releasing payment:", error);
    return res
      .status(500)
      .json({ message: "Failed to release payout", error: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  releasePayment,
};
