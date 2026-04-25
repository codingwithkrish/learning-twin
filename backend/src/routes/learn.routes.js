const express = require("express");
const router = express.Router();
const geminiService = require("../services/gemini.service");
const authMiddleware = require("../middleware/auth.middleware");

// Get explanation
router.post("/explain", authMiddleware, async (req, res) => {
  try {
    const { topic, level } = req.body;
    const explanation = await geminiService.generateExplanation(topic, level);
    res.json(explanation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate quiz
router.post("/quiz", authMiddleware, async (req, res) => {
  try {
    const { topic, difficulty, numQuestions } = req.body;
    const quiz = await geminiService.generateQuiz(topic, difficulty, numQuestions);
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
