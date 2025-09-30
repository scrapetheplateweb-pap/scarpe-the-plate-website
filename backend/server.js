const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const bookingsRouter = require("./routes/bookings");
const adminRouter = require("./routes/admin");
const chatProxyRouter = require("./routes/chatProxy");

app.use("/api/bookings", bookingsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatProxyRouter);

app.get("/api", (req, res) => {
  res.json({ message: "Scrape the Plate v4 Backend API" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Backend running on http://127.0.0.1:${PORT}`);
});
