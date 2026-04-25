const KnowledgeGraph = require("../models/KnowledgeGraph");
const geminiService = require("./gemini.service");

class AdaptiveService {
  /**
   * Adds a new topic to the user's knowledge graph.
   */
  async addTopicToGraph(userId, topic) {
    let graph = await KnowledgeGraph.findOne({ userId });
    if (!graph) {
      graph = new KnowledgeGraph({ userId, concepts: [] });
    }

    let concept = graph.concepts.find(c => c.title.toLowerCase() === topic.toLowerCase());
    if (!concept) {
      concept = { title: topic, masteryLevel: 0, confusionScore: 0, isWeakNode: false, relatedConcepts: [] };
      graph.concepts.push(concept);
      await graph.save();
    }
    
    return graph;
  }

  /**
   * Updates the mastery level and confusion score after a session.
   */
  async updateProgress(userId, topic, sessionData) {
    const { correctness, confidence, timeTaken, userResponse } = sessionData;
    
    let graph = await KnowledgeGraph.findOne({ userId });
    if (!graph) {
      graph = new KnowledgeGraph({ userId, concepts: [] });
    }

    let concept = graph.concepts.find(c => c.title.toLowerCase() === topic.toLowerCase());
    if (!concept) {
      concept = { title: topic, masteryLevel: 0, confusionScore: 0 };
      graph.concepts.push(concept);
    }

    // Logic for adaptive updates
    // If correct + confident -> large mastery increase
    // If wrong -> decrease mastery + check for misconceptions
    let masteryDelta = 0;
    if (correctness === "correct") {
      masteryDelta = confidence > 0.7 ? 15 : 8;
      concept.confusionScore = Math.max(0, concept.confusionScore - 0.2);
    } else {
      masteryDelta = -5;
      concept.confusionScore = Math.min(1, concept.confusionScore + 0.3);
      
      // Check for misconceptions via AI
      const analysis = await geminiService.detectMisconceptions(topic, userResponse);
      if (analysis.has_misconception) {
        concept.misconceptions.push(analysis.misconception_details);
      }
    }

    concept.masteryLevel = Math.min(100, Math.max(0, concept.masteryLevel + masteryDelta));
    concept.isWeakNode = concept.masteryLevel < 40 || concept.confusionScore > 0.6;
    concept.lastSessionDate = new Date();

    await graph.save();
    return concept;
  }

  /**
   * Recommends the next topics based on the graph.
   */
  async getRecommendations(userId) {
    const graph = await KnowledgeGraph.findOne({ userId });
    if (!graph) return ["Getting Started", "Core Concepts"];

    const weakNodes = graph.concepts.filter(c => c.isWeakNode);
    const completedNodes = graph.concepts.filter(c => c.masteryLevel > 80);

    // Recommend revision for weak nodes or new related topics for completed nodes
    let recs = weakNodes.map(c => `Revise: ${c.title}`);
    if (recs.length < 3) {
      // Add some new topics (mock logic for now)
      recs.push("Advanced Applications", "Related Systems");
    }

    return recs.slice(0, 5);
  }
}

module.exports = new AdaptiveService();
