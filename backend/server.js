const express = require("express");
const cors = require("cors");
const axios = require("axios");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

if (!process.env.SESSION_SECRET && process.env.NODE_ENV === 'production') {
  console.error('ERROR: SESSION_SECRET environment variable must be set in production');
  process.exit(1);
}

app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

if (!process.env.SESSION_SECRET) {
  console.warn('WARNING: Using default session secret. Set SESSION_SECRET environment variable for production use.');
} else {
  console.log('✓ Using PostgreSQL session store - sessions will persist across server restarts');
}

const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const userBookingsRouter = require("./routes/userBookings");
const bookingsRouter = require("./routes/bookings");
const adminRouter = require("./routes/admin");
const chatProxyRouter = require("./routes/chatProxy");
const activityRouter = require("./routes/activity");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");
const stripeRouter = require("./routes/stripe");
const careersRouter = require("./routes/careers");
const sectionsRouter = require("./routes/sections");

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/user-bookings", userBookingsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatProxyRouter);
app.use("/api/activity", activityRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/careers", careersRouter);
app.use("/api/sections", sectionsRouter);

app.get("/api", (req, res) => {
  res.json({ message: "Scrape the Plate v4 Backend API" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Backend running on http://127.0.0.1:${PORT}`);
});
