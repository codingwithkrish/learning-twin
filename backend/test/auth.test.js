const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("../src/routes/auth.routes");
const User = require("../src/models/User");
const bcrypt = require("bcryptjs");

jest.mock("../src/models/User");
jest.mock("bcryptjs");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth Routes API", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "testsecret";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("should successfully register a new user", async () => {
      User.prototype.save = jest.fn().mockResolvedValue(true);
      
      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "testuser", email: "test@test.com", password: "password123" });
        
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User created");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login user with correct credentials", async () => {
      const mockUser = {
        _id: "fakeId123",
        username: "testuser",
        email: "test@test.com",
        password: "hashedPassword"
      };
      
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@test.com", password: "password123" });
        
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.username).toBe("testuser");
    });

    it("should reject login with wrong password", async () => {
      const mockUser = {
        _id: "fakeId123",
        username: "testuser",
        email: "test@test.com",
        password: "hashedPassword"
      };
      
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);
      
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@test.com", password: "wrongpassword" });
        
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid credentials");
    });
  });
});
