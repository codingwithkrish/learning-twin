const express = require("express");
const router = express.Router();
const geminiService = require("../services/gemini.service");
const authMiddleware = require("../middleware/auth.middleware");

// Conversational Tutor Chat
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message, topic, history } = req.body;
    
    const prompt = `
      You are the "Learning Twin" AI Tutor. You are helping a user master the topic: "${topic}".
      
      Previous conversation context:
      ${JSON.stringify(history)}
      
      User says: "${message}"
      
      Provide a helpful, encouraging, and intellectually stimulating response. 
      If the user is confused, use an analogy. 
      If they understand, challenge them with a small insight.
      Keep it concise and formatted for a chat UI.
    `;

    const result = await geminiService.model.generateContent(prompt);
    const response = await result.response;
    res.json({ content: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
