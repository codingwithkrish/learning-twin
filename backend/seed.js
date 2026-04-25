const mongoose = require("mongoose");
const User = require("./src/models/User");
const KnowledgeGraph = require("./src/models/KnowledgeGraph");
const Analytics = require("./src/models/Analytics");
require("dotenv").config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Create a demo user if it doesn't exist
    let user = await User.findOne({ email: "demo@learningtwin.ai" });
    if (!user) {
      user = new User({
        username: "Krish",
        email: "demo@learningtwin.ai",
        password: "password123" // Will be hashed by pre-save hook
      });
      await user.save();
      console.log("Demo user created.");
    }

    // Clear existing graph for demo user
    await KnowledgeGraph.deleteOne({ userId: user._id });

    // Create a rich knowledge graph
    const demoGraph = new KnowledgeGraph({
      userId: user._id,
      concepts: [
        { title: "Neural Networks", masteryLevel: 78, confusionScore: 0.1, relatedConcepts: ["Backpropagation", "Activation Functions"] },
        { title: "Backpropagation", masteryLevel: 42, confusionScore: 0.6, isWeakNode: true, relatedConcepts: ["Calculus", "Chain Rule"] },
        { title: "React Hooks", masteryLevel: 92, confusionScore: 0.05, relatedConcepts: ["State Management", "useEffect"] },
        { title: "Quantum Computing", masteryLevel: 15, confusionScore: 0.8, isWeakNode: true, relatedConcepts: ["Superposition", "Entanglement"] },
        { title: "Distributed Systems", masteryLevel: 55, confusionScore: 0.3, relatedConcepts: ["CAP Theorem", "Raft Consensus"] }
      ]
    });

    await demoGraph.save();
    console.log("Knowledge Graph seeded.");

    // Clear and seed Analytics
    await Analytics.deleteOne({ userId: user._id });

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const randomLearningData = days.map(day => ({
      day,
      concepts: Math.floor(Math.random() * 40) + 5
    }));

    const randomRetentionData = [1, 5, 10, 15, 20, 25, 30].map(day => ({
      day,
      rate: Math.floor(Math.random() * 30) + 70 // 70 to 100
    }));

    const randomSubjectData = [
      { name: 'Computer Science', value: Math.floor(Math.random() * 50) + 20, color: '#6366F1' },
      { name: 'Mathematics', value: Math.floor(Math.random() * 40) + 10, color: '#4edea3' },
      { name: 'Design Theory', value: Math.floor(Math.random() * 30) + 10, color: '#ffb783' }
    ];

    const demoAnalytics = new Analytics({
      userId: user._id,
      learningData: randomLearningData,
      retentionData: randomRetentionData,
      subjectData: randomSubjectData,
      topicsToRevisit: [
        { title: 'Advanced CSS', recall: Math.floor(Math.random() * 40) + 20, icon: 'CSS' },
        { title: 'Linear Algebra', recall: Math.floor(Math.random() * 40) + 20, icon: 'Σ' }
      ]
    });

    await demoAnalytics.save();
    console.log("Analytics seeded.");


    process.exit(0);
  } catch (error) {
    console.error("Seed Error:", error);
    process.exit(1);
  }
};

seed();
