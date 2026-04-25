const request = require("supertest");
const express = require("express");
const learnRoutes = require("../src/routes/learn.routes");
const geminiService = require("../src/services/gemini.service");

// Mocking the external Google Service
jest.mock("../src/services/gemini.service");

// Mocking Authentication Middleware
jest.mock("../src/middleware/auth.middleware", () => (req, res, next) => {
  req.userData = { userId: "test-user-id" };
  next();
});

const app = express();
app.use(express.json());
app.use("/api/learn", learnRoutes);

describe("Learn Routes API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/learn/quiz", () => {
    it("should successfully generate a quiz and return 200", async () => {
      const mockQuiz = {
        questions: [
          { id: "q1", question: "What is React?", options: ["A", "B"], correct_answer: "A" }
        ]
      };
      
      geminiService.generateQuiz.mockResolvedValue(mockQuiz);

      const response = await request(app)
        .post("/api/learn/quiz")
        .send({ topic: "React", difficulty: "easy", numQuestions: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuiz);
      expect(geminiService.generateQuiz).toHaveBeenCalledWith("React", "easy", 1);
    });

    it("should handle missing parameters gracefully", async () => {
      geminiService.generateQuiz.mockRejectedValue(new Error("Missing topic"));

      const response = await request(app)
        .post("/api/learn/quiz")
        .send({ difficulty: "easy" });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Missing topic");
    });
  });
});
