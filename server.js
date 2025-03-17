require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // ✅ Import the MongoDB connection function

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Welcome to Task Manager API 🚀");
});

// ✅ Connect to MongoDB
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: "Route not found ❌" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
