const request = require("supertest");
const express = require("express");
const progressRoutes = require("../src/routes/progress.routes");
const adaptiveService = require("../src/services/adaptive.service");
const KnowledgeGraph = require("../src/models/KnowledgeGraph");
const Analytics = require("../src/models/Analytics");

jest.mock("../src/services/adaptive.service");
jest.mock("../src/models/KnowledgeGraph", () => ({
  findOne: jest.fn()
}));
jest.mock("../src/models/Analytics", () => ({
  findOne: jest.fn()
}));

jest.mock("../src/middleware/auth.middleware", () => (req, res, next) => {
  req.userData = { userId: "test-user-id" };
  next();
});

const app = express();
app.use(express.json());
app.use("/api/progress", progressRoutes);

describe("Progress Routes API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/progress/recommendations", () => {
    it("should return recommendations from adaptive service", async () => {
      adaptiveService.getRecommendations.mockResolvedValue(["React", "Node.js"]);
      const res = await request(app).get("/api/progress/recommendations");
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(["React", "Node.js"]);
      expect(adaptiveService.getRecommendations).toHaveBeenCalledWith("test-user-id");
    });
  });

  describe("POST /api/progress/add-topic", () => {
    it("should successfully add a new topic to the graph", async () => {
      const mockGraph = { concepts: [{ title: "CSS" }] };
      adaptiveService.addTopicToGraph.mockResolvedValue(mockGraph);
      
      const res = await request(app)
        .post("/api/progress/add-topic")
        .send({ topic: "CSS" });
        
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockGraph);
    });

    it("should return 400 if topic is missing", async () => {
      const res = await request(app).post("/api/progress/add-topic").send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Topic is required");
    });
  });
});
