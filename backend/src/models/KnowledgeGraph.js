const mongoose = require("mongoose");

const conceptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  masteryLevel: { type: Number, default: 0 }, // 0 to 100
  confusionScore: { type: Number, default: 0 }, // 0 to 1
  isWeakNode: { type: Boolean, default: false },
  lastSessionDate: { type: Date, default: Date.now },
  relatedConcepts: [{ type: String }], // Titles of related nodes
  misconceptions: [{ type: String }]
});

const knowledgeGraphSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  concepts: [conceptSchema],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("KnowledgeGraph", knowledgeGraphSchema);
