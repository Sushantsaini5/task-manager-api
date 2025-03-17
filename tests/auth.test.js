const request = require("supertest");
const app = require("../server"); // Import your Express app
const mongoose = require("mongoose");

describe("Auth API", () => {
  let server;

  beforeAll(async () => {
    server = request(app);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Register a new user", async () => {
    const res = await server.post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("Login with correct credentials", async () => {
    const res = await server.post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Fail login with wrong password", async () => {
    const res = await server.post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
