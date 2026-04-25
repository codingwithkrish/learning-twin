const express = require("express");
const router = express.Router();
const adaptiveService = require("../services/adaptive.service");
const authMiddleware = require("../middleware/auth.middleware");
const KnowledgeGraph = require("../models/KnowledgeGraph");

// Update progress after session
router.post("/update", authMiddleware, async (req, res) => {
  try {
    const { topic, sessionData } = req.body;
    const updatedConcept = await adaptiveService.updateProgress(req.userData.userId, topic, sessionData);
    res.json(updatedConcept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get entire knowledge graph
router.get("/graph", authMiddleware, async (req, res) => {
  try {
    const graph = await KnowledgeGraph.findOne({ userId: req.userData.userId });
    res.json(graph || { concepts: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recommendations
router.get("/recommendations", authMiddleware, async (req, res) => {
  try {
    const recs = await adaptiveService.getRecommendations(req.userData.userId);
    res.json(recs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
