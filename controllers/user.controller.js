const userModel = require("../models/user.model");
const otpModel = require("../models/otp.model");
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/sendEmail");
const signupOtpTemplate = require("../utils/emailTemplates/signupOtp");

// create and  send otp
const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    await otpModel.deleteMany({ email });
    const newOtp = await otpModel.create({ email, otp });

    await sendEmail({
      to: email,
      subject: "Your OTP for RebookHub Registration",
      text: `Your OTP for RebookHub is: ${otp}. If you didn't request this, please ignore this email.`,
      html: signupOtpTemplate(otp),
    });

    res.status(200).json({ message: "OTP sent successfully to your email." });
  } catch (error) {
    console.error("Error sending otp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// user register
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, address, phoneNumber, otp } =
    req.body;
  if (!otp) {
    return res.status(401).json({
      message: "Otp is required",
    });
  }

  try {
    console.log("otp : ", otp);
    const savedOtp = await otpModel.findOne({ email, otp });
    if (!savedOtp || savedOtp.otp !== otp) {
      return res.status(401).json({
        message: "Invalid Otp",
      });
    }

    const hashedPassword = await userModel.hashPassword(password, 10);

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      password: hashedPassword,
    });
    user.password = undefined;

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Error while registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  sendOtp,
  registerUser,
};
