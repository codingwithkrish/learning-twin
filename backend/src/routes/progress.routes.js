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

// Add new topic to graph
router.post("/add-topic", authMiddleware, async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });
    const updatedGraph = await adaptiveService.addTopicToGraph(req.userData.userId, topic);
    res.json(updatedGraph);
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

// Get analytics
router.get("/analytics", authMiddleware, async (req, res) => {
  try {
    const Analytics = require("../models/Analytics");
    let analytics = await Analytics.findOne({ userId: req.userData.userId });
    
    // If no analytics exist, return empty shell
    if (!analytics) {
      analytics = {
        learningData: [],
        retentionData: [],
        subjectData: [],
        topicsToRevisit: []
      };
    }
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
