const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google Sign-In Integration (Google Services Category)
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Verify the Google token directly with Google APIs
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    // Find or create user securely
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        username: payload.name,
        email: payload.email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-12), 10) 
      });
      await user.save();
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, username: user.username });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: "Invalid Google Token" });
  }
});

module.exports = router;
