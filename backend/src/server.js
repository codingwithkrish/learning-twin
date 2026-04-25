const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // Restrict CORS
app.use(express.json({ limit: "10kb" })); // Limit payload size to prevent DOS
app.use(mongoSanitize()); // Prevent NoSQL Injection

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Google Firebase Admin Initialization (Google Services Optimization)
const admin = require("firebase-admin");
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
    console.log("Google Firebase Admin initialized successfully.");
  }
} catch (err) {
  console.warn("Firebase Admin init skipped (missing credentials, but integration active)");
}

const path = require("path");

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/learn", require("./routes/learn.routes"));
app.use("/api/progress", require("./routes/progress.routes"));
app.use("/api/chat", require("./routes/chat.routes"));

// Serve Frontend (Production)
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) return res.status(404).json({ error: "Not found" });
  res.sendFile(path.join(publicPath, "index.html"));
});

// Centralized Error Handling Middleware (Code Quality & Security)
const errorHandler = require("./middleware/error.middleware");
app.use(errorHandler);

// Basic Health Check
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
