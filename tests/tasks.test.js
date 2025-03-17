const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const Task = require("../models/Task");
let token;

beforeAll(async () => {
  const res = await request(app).post("/api/auth/login").send({
    email: "test@example.com",
    password: "password123",
  });
  token = res.body.token;
});

afterAll(async () => {
  await Task.deleteMany({});
  await mongoose.connection.close();
});

describe("Task API", () => {
  let taskId;

  test("Create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Task description",
        priority: "high",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");
    taskId = res.body._id;
  });

  test("Get tasks with pagination & filters", async () => {
    const res = await request(app)
      .get("/api/tasks?page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Update a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "completed" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("completed");
  });

  test("Delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted");
  });
});
