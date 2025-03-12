const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDb = require("./utils/connectToDb");

const userRoutes = require("./routes/user.routes");

app.use(express.json());
app.use(cors());
app.use(cookieParser());

connectToDb();

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send(
    "<center> <h1> Welcome to ReBook Hub 🔄📖 — Where books find new homes.  </h1> </center>"
  );
});

module.exports = app;
