const express = require("express");
const cors = require("cors");
const axios = require("axios");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db");
const path = require("path");
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

// Configure session store based on database type
let sessionStore;
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sqlite')) {
  // Use file system session store for SQLite (simpler for local development)
  const FileStore = require('session-file-store')(session);
  sessionStore = new FileStore({
    path: './sessions',
    ttl: 86400 * 7, // 7 days
    reapInterval: 3600 // cleanup every hour
  });
  console.log('✓ Using file-based session store for local development');
} else {
  // Use PostgreSQL session store for production
  sessionStore = new pgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true
  });
  console.log('✓ Using PostgreSQL session store - sessions will persist across server restarts');
}

app.use(session({
  store: sessionStore,
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
}

const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const userBookingsRouter = require("./routes/userBookings");
const bookingsRouter = require("./routes/bookings");
const adminRouter = require("./routes/admin");
const adminAuthRouter = require("./routes/admin-auth");
const activityRouter = require("./routes/activity");
const chatProxyRouter = require("./routes/chatProxy");
const mobilesettingsRouter = require("./routes/mobile-settings");
const ordersRouter = require("./routes/orders");
const cartRouter = require("./routes/cart");
const sectionsRouter = require("./routes/sections");
const productsRouter = require("./routes/products");
const stripeRouter = require("./routes/stripe");
const careersRouter = require("./routes/careers");

app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/user-bookings", userBookingsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin-auth", adminAuthRouter);
app.use("/api/activity", activityRouter);
app.use("/api/chat", chatProxyRouter);
app.use("/api/mobile-settings", mobilesettingsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/cart", cartRouter);
app.use("/api/sections", sectionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/careers", careersRouter);

// Chatbot route proxy
app.post("/chat", async (req, res) => {
  try {
    const chatbotUrl = process.env.CHATBOT_URL || "http://localhost:5001";
    const response = await axios.post(`${chatbotUrl}/chat`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error("Chatbot proxy error:", error.message);
    res.status(500).json({ error: "Chatbot service unavailable" });
  }
});

// Serve static frontend files in production
const distPath = path.join(__dirname, '..', 'frontend', 'dist');

// Serve static files from dist directory
app.use(express.static(distPath));

// API health check
app.get("/api/health", (req, res) => {
  const fs = require('fs');
  const distPath = path.join(__dirname, '..', 'frontend', 'dist');
  
  let buildInfo = {};
  try {
    buildInfo.distExists = fs.existsSync(distPath);
    buildInfo.indexExists = fs.existsSync(path.join(distPath, 'index.html'));
    buildInfo.distContents = buildInfo.distExists ? fs.readdirSync(distPath) : [];
  } catch (error) {
    buildInfo.error = error.message;
  }
  
  res.json({ 
    message: "Scrape the Plate v4 Backend API",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    buildInfo: buildInfo,
    paths: {
      currentDir: __dirname,
      distPath: distPath
    }
  });
});

// Catch all handler for React routing - must be last
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  const indexPath = path.join(distPath, 'index.html');
  
  // Check if index.html exists
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <h1>Frontend Build Not Found</h1>
      <p>The frontend build files are missing.</p>
      <p>Expected location: ${distPath}</p>
      <p>Make sure the build command completed successfully.</p>
    `);
  }
});

console.log('✓ Serving static frontend from:', distPath);

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Accept connections from any device
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`🌐 Access from other devices: http://[YOUR-COMPUTER-IP]:${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('✓ Production mode: serving frontend + API on port', PORT);
  }
});