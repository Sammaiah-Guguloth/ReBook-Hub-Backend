const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDb = require("./utils/connectToDb");
const fileUpload = require("express-fileupload");

const userRoutes = require("./routes/user.routes");
const bookRoutes = require("./routes/book.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const homeRoutes = require("./routes/home.routes");
const paymentRoutes = require("./routes/payments.routes");
const orderRoutes = require("./routes/orders.routes");
const mockDeliveryRoutes = require("./routes/mockDelivery.routes");
const webhooksRoutes = require("./routes/webhooks.routes");

const port = process.env.PORT || 3000;

app.use(express.json());
// const corsOptions = {
//   origin: process.env.FRONTEND_BASE_URL,
//   credentials: true,
// };

const allowedOrigins = [
  process.env.FRONTEND_BASE_URL,
  "http://localhost:5173", // Example for local testing
  "https://rebookhub-server.onrender.com",
  "https://rebookhub1.netlify.app/about",
  "https://686647556d4f6bb9af01ce2a--rebookhub1.netlify.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin like mobile apps or curl requests
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(fileUpload()); // To parse file uploads

connectToDb();

app.use("/user", userRoutes);
app.use("/book", bookRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/home", homeRoutes);
app.use("/payments", paymentRoutes);
app.use("/orders", orderRoutes);
app.use("/mock-delivery", mockDeliveryRoutes);
app.use("/webhooks", webhooksRoutes);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(
    "<center> <h1> Welcome to ReBook Hub 🔄📖 — Where books find new homes.  </h1> </center>"
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
