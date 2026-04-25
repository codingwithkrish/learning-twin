/**
 * Unit tests for Adaptive Learning Logic
 */
const adaptiveService = require('../services/adaptive.service');
const KnowledgeGraph = require('../models/KnowledgeGraph');

// Mocking KnowledgeGraph model
jest.mock('../models/KnowledgeGraph');

describe('AdaptiveService', () => {
  test('should increase mastery for correct and confident responses', async () => {
    const userId = 'user123';
    const topic = 'React Hooks';
    const sessionData = {
      correctness: 'correct',
      confidence: 0.9,
      timeTaken: 120
    };

    // Mock findOne to return a graph
    KnowledgeGraph.findOne.mockResolvedValue({
      concepts: [{ title: 'React Hooks', masteryLevel: 50, confusionScore: 0.2 }],
      save: jest.fn()
    });

    const result = await adaptiveService.updateProgress(userId, topic, sessionData);
    
    // Mastery should increase from 50 (delta 15 for high confidence)
    expect(result.masteryLevel).toBe(65);
    expect(result.isWeakNode).toBe(false);
  });

  test('should decrease mastery and mark as weak node on wrong answer', async () => {
    const userId = 'user123';
    const topic = 'Quantum Computing';
    const sessionData = {
      correctness: 'incorrect',
      confidence: 0.4,
      timeTaken: 300,
      userResponse: "I don't know"
    };

    KnowledgeGraph.findOne.mockResolvedValue({
      concepts: [{ title: 'Quantum Computing', masteryLevel: 42, confusionScore: 0.3, misconceptions: [] }],
      save: jest.fn()
    });

    const result = await adaptiveService.updateProgress(userId, topic, sessionData);
    
    expect(result.masteryLevel).toBeLessThan(42);
    expect(result.isWeakNode).toBe(true);
  });
});
