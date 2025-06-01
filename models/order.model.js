const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    buyer: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      postal: String,
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,

    status: {
      type: String,
      enum: [
        "pending_payment",
        "paid",
        "pending_seller_confirmation",
        "seller_accepted",
        "shipped",
        "delivered",
        "rejected",
        "refunded",
      ],
      default: "pending_payment",
    },
    tracking: {
      courier: String,
      trackingId: String,
    },

    payout: {
      method: {
        type: String,
        enum: ["upi", "bank"],
      },
      name: String,
      upi: String,
      accountNumber: String,
      ifsc: String,
      contactId: String,
      fundAccountId: String,
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
