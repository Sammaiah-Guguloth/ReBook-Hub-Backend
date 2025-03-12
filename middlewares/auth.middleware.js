const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blackListToken.model");
const userModel = require("../models/user.model");

// user auth
const authUser = async (req, res, next) => {
  try {
    console.log("req.cookies : ", req?.cookies);
    const token =
      req.cookies?.token || req.headers?.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const isBlackListed = await blackListTokenModel.findOne({ token });
    if (isBlackListed) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log("Error while authenticating user : ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  authUser,
};
