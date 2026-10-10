const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const Transaction = require("./models/Transaction");
const SavingsGoal = require("./models/SavingsGoal");
const Habit = require("./models/Habit");
const Investment = require("./models/Investment");
const Asset = require("./models/Asset");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Financial Habit Builder backend is running!",
  });
});

// CREATE TRANSACTION
app.post("/api/transactions", async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);

    res.status(201).json({
      success: true,
      transaction,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// GET ALL TRANSACTIONS
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({
      date: -1,
    });

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE TRANSACTION
app.put("/api/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      message: "Transaction updated successfully!",
      transaction,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE TRANSACTION
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(
      req.params.id
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      message: "Transaction deleted successfully!",
      transaction,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// TEST CATEGORY
app.get("/api/test-category", async (req, res) => {
  try {
    const transaction = await Transaction.findById(
      "6ac682147b7d24bb3eee717d"
    );

    res.json({
      success: true,
      schemaPaths: Object.keys(Transaction.schema.paths),
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// CREATE SAVINGS GOAL
app.post("/api/goals", async (req, res) => {
  try {
    const goal = await SavingsGoal.create(req.body);

    res.status(201).json({
      success: true,
      goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// GET ALL SAVINGS GOALS
app.get("/api/goals", async (req, res) => {
  try {
    const goals = await SavingsGoal.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE SAVINGS GOAL
app.put("/api/goals/:id", async (req, res) => {
  try {
    const goal = await SavingsGoal.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found",
      });
    }

    res.json({
      success: true,
      goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ADD MONEY TO SAVINGS GOAL
app.patch("/api/goals/:id/add-money", async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid positive amount",
      });
    }

    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found",
      });
    }

    if (goal.saved + amount > goal.target) {
      return res.status(400).json({
        success: false,
        message: "Amount exceeds the remaining goal",
      });
    }

    goal.saved += amount;
    await goal.save();

    res.json({
      success: true,
      goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE SAVINGS GOAL
app.delete("/api/goals/:id", async (req, res) => {
  try {
    const goal = await SavingsGoal.findByIdAndDelete(
      req.params.id
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found",
      });
    }

    res.json({
      success: true,
      message: "Savings goal deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

 // CREATE HABIT
app.post("/api/habits", async (req, res) => {
  try {
    const habit = await Habit.create(req.body);
    res.status(201).json({ success: true, habit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET ALL HABITS
app.get("/api/habits", async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: 1 });
    res.json({ success: true, habits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE HABIT
app.patch("/api/habits/:id", async (req, res) => {
  try {
    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    res.json({ success: true, habit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE HABIT
app.delete("/api/habits/:id", async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    res.json({
      success: true,
      message: "Habit deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

 // CREATE INVESTMENT
app.post("/api/investments", async (req, res) => {
  try {
    const investment = await Investment.create(req.body);
    res.status(201).json({ success: true, investment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET ALL INVESTMENTS
app.get("/api/investments", async (req, res) => {
  try {
    const investments = await Investment.find().sort({ createdAt: -1 });
    res.json({ success: true, investments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE INVESTMENT
app.put("/api/investments/:id", async (req, res) => {
  try {
    const investment = await Investment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!investment) {
      return res.status(404).json({ success: false, message: "Investment not found" });
    }
    res.json({ success: true, investment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE INVESTMENT
app.delete("/api/investments/:id", async (req, res) => {
  try {
    const investment = await Investment.findByIdAndDelete(req.params.id);
    if (!investment) {
      return res.status(404).json({ success: false, message: "Investment not found" });
    }
    res.json({ success: true, message: "Investment deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// CREATE ASSET
app.post("/api/assets", async (req, res) => {
  try {
    const asset = await Asset.create(req.body);
    res.status(201).json({ success: true, asset });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET ALL ASSETS
app.get("/api/assets", async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json({ success: true, assets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE ASSET
app.put("/api/assets/:id", async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!asset) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
    res.json({ success: true, asset });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE ASSET
app.delete("/api/assets/:id", async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
    res.json({ success: true, message: "Asset deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(
    `Backend server running on http://localhost:${PORT}`
  );
});