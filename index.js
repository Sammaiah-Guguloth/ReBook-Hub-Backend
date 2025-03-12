const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const connectToDb = require("./utils/connectToDb");

const userRoutes = require("./routes/user.routes");

app.use(express.json());
app.use(cors());

connectToDb();

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send(
    "<center> <h1> Welcome to ReBook Hub 🔄📖 — Where books find new homes.  </h1> </center>"
  );
});

module.exports = app;
