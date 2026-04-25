const request = require("supertest");
const express = require("express");
const chatRoutes = require("../src/routes/chat.routes");
const geminiService = require("../src/services/gemini.service");

jest.mock("../src/services/gemini.service");

// Mocking Authentication Middleware
jest.mock("../src/middleware/auth.middleware", () => (req, res, next) => {
  req.userData = { userId: "test-user-id" };
  next();
});

const app = express();
app.use(express.json());
app.use("/api/chat", chatRoutes);

describe("Chat Routes API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/chat", () => {
    it("should process chat message and return AI response", async () => {
      const mockAiResponse = {
        response: { text: () => "Here is a personalized explanation about Neural Networks." }
      };
      
      // Mock the generative model response
      geminiService.model = {
        generateContent: jest.fn().mockResolvedValue(mockAiResponse)
      };

      const res = await request(app)
        .post("/api/chat")
        .send({
          message: "Explain this to me",
          topic: "Neural Networks",
          history: []
        });

      expect(res.status).toBe(200);
      expect(res.body.content).toBe("Here is a personalized explanation about Neural Networks.");
      expect(res.body.role).toBe("assistant");
    });

    it("should handle chat generation errors", async () => {
      geminiService.model = {
        generateContent: jest.fn().mockRejectedValue(new Error("AI Model overloaded"))
      };

      const res = await request(app)
        .post("/api/chat")
        .send({
          message: "Hello",
          topic: "React",
          history: []
        });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("AI Model overloaded");
    });
  });
});
