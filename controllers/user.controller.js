const userModel = require("../models/user.model");
const otpModel = require("../models/otp.model");
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/sendEmail");
const signupOtpTemplate = require("../utils/emailTemplates/signupOtp");
const blackListTokenModel = require("../models/blackListToken.model");

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

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exist" });
    }

    if (!otp) {
      return res.status(401).json({
        message: "Otp is required",
      });
    }

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

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = await user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true, // Makes the cookie inaccessible to JavaScript (for security).
      // secure: true,          // Ensures cookie is sent over HTTPS only (Enable only in production).
      sameSite: "lax", // Protects against CSRF attacks (use 'strict' or 'lax').
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week (Specify cookie expiration time in milliseconds).
    });

    return res.status(200).json({
      user: user,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log("Error while logging user in : ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// user logout
const logOutUser = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    res.clearCookie("token");

    await blackListTokenModel.create({ token });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error while logging user out : ", error);
  }
};

// get user profile
const getUserProfile = async (req, res) => {
  req.user.password = undefined;

  return res.status(200).json({
    message: "User profile retrieved successfully",
    user: req.user,
  });
};

// Helper to flatten nested objects like { address: { city: "New" } } into { "address.city": "New" }
function flattenObject(obj, prefix = "", res = {}) {
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value, newKey, res);
    } else {
      res[newKey] = value;
    }
  }
  return res;
}

const updateUser = async (req, res) => {
  const userId = req.user._id;
  const updates = req.body;

  try {
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Flatten the updates object to allow partial nested updates
    const flatUpdates = flattenObject(updates);

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: flatUpdates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendOtp,
  registerUser,
  loginUser,
  logOutUser,
  getUserProfile,
  updateUser,
};
