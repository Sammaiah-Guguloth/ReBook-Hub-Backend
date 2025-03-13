const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDb = require("./utils/connectToDb");
const fileUpload = require("express-fileupload");

const userRoutes = require("./routes/user.routes");
const bookRoutes = require("./routes/book.routes");

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(fileUpload()); // To parse file uploads

connectToDb();

app.use("/user", userRoutes);
app.use("/book", bookRoutes);
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(
    "<center> <h1> Welcome to ReBook Hub 🔄📖 — Where books find new homes.  </h1> </center>"
  );
});

module.exports = app;
