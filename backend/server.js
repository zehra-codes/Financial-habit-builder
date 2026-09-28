const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected successfully!"))
.catch((error) => console.error("MongoDB connection failed:", error));

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Financial Habit Builder backend is running!",
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});