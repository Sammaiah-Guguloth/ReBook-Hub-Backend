const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcyrpt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "First name must be at least 3 characters long"],
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    village: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/,
  },
  booksBought: [{ type: mongoose.Schema.Types.ObjectId, ref: "book" }],
  booksSold: [{ type: mongoose.Schema.Types.ObjectId, ref: "book" }],
  myBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "book" }],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

userSchema.statics.hashPassword = function (password) {
  return bcyrpt.hash(password, 10);
};
userSchema.methods.comparePassword = function (password) {
  return bcyrpt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
