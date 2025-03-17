const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

let redis;
try {
  redis = require("../config/redis"); // Redis को safely require करें
} catch (error) {
  console.warn("⚠ Redis not configured properly, running without cache");
}

const router = express.Router();

// ✅ Create Task
router.post("/", auth, async (req, res) => {
  try {
    if (!req.user?.userId)
      return res.status(401).json({ message: "Unauthorized" });

    const task = new Task({ ...req.body, userId: req.user.userId });
    await task.save();

    res.status(201).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
});

// ✅ Get Tasks with Pagination & Filtering
router.get("/", auth, async (req, res) => {
  try {
    console.log("🔵 GET /api/tasks hit by user:", req.user?.userId);
    if (!req.user?.userId)
      return res.status(401).json({ message: "Unauthorized" });

    const { status, priority, page = 1, limit = 10 } = req.query;
    const filters = { userId: req.user.userId };

    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const cacheKey = `tasks:${req.user.userId}:${JSON.stringify(req.query)}`;

    if (redis) {
      const cachedTasks = await redis.get(cacheKey);
      if (cachedTasks) {
        console.log("✅ Serving from cache");
        return res.json(JSON.parse(cachedTasks));
      }
    }

    const tasks = await Task.find(filters)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (redis) {
      await redis.set(cacheKey, JSON.stringify(tasks), "EX", 3600);
    }

    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
});

// ✅ Update Task
router.put("/:id", auth, async (req, res) => {
  try {
    if (!req.user?.userId)
      return res.status(401).json({ message: "Unauthorized" });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
});

// ✅ Delete Task
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.user?.userId)
      return res.status(401).json({ message: "Unauthorized" });

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
});

module.exports = router;
