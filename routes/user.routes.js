const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");

router.post(
  "/register",
  [
    body("firstName")
      .exists({ checkFalsy: true })
      .withMessage("Phone number is required")
      .isLength({ min: 3 })
      .withMessage("First name must be atleast 3 characters long"),
    body("email")
      .exists({ checkFalsy: true })
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email"),
    body("password")
      .exists({ checkFalsy: true })
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters long"),
    body("address.street")
      .exists({ checkFalsy: true })
      .withMessage("Street is required"),
    body("address.village")
      .exists({ checkFalsy: true })
      .withMessage("Town is required"),
    body("address.city")
      .exists({ checkFalsy: true })
      .withMessage("City is required"),
    body("address.pincode")
      .exists({ checkFalsy: true })
      .withMessage("Pincode is required")
      .isLength({ min: 6, max: 6 })
      .withMessage("Pincode must be exactly 6 digits long")
      .isNumeric()
      .withMessage("Pincode must be a number"),
    body("phoneNumber")
      .exists({ checkFalsy: true })
      .withMessage("Phone number is required")
      .matches(/^[6-9]\d{9}$/)
      .withMessage(
        "Phone number must be a valid 10-digit Indian mobile number starting with 6-9"
      ),
  ],
  userController.registerUser
);

router.post(
  "/send-otp",
  [
    body("email")
      .exists({ checkFalsy: true })
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email"),
  ],
  userController.sendOtp
);

module.exports = router;
