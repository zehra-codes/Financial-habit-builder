const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Transaction = require("./models/Transaction");
const SavingsGoal = require("./models/SavingsGoal");
const Habit = require("./models/Habit");
const Investment = require("./models/Investment");
const Asset = require("./models/Asset");
const Feedback = require("./models/Feedback");

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

function createAuthToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 72
    ) {
      return res.status(400).json({
        message: "Enter a valid name and email, and a password of 8–72 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = createAuthToken(user);

    return res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", error.message);
    return res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password ||
      password.length > 72
    ) {
      return res.status(400).json({
        message: "Enter your email and password.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createAuthToken(user);

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
});

 // GET ALL FEEDBACK
app.get("/api/feedback", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error("Fetch feedback error:", error.message);
    res.status(500).json({ message: "Failed to load feedback." });
  }
});

// CREATE FEEDBACK
app.post("/api/feedback", async (req, res) => {
  try {
    const { type, message } = req.body;

    if (
      !["Feedback", "Complaint"].includes(type) ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "A valid type and message are required.",
      });
    }

    const feedback = await Feedback.create({
      type,
      message: message.trim(),
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error("Create feedback error:", error.message);
    res.status(500).json({ message: "Failed to create feedback." });
  }
});

// UPDATE FEEDBACK STATUS
app.patch("/api/feedback/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Open", "Resolved"].includes(status)) {
      return res.status(400).json({
        message: "Invalid feedback status.",
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid feedback ID.",
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found.",
      });
    }

    res.json(feedback);
  } catch (error) {
    console.error("Update feedback error:", error.message);
    res.status(500).json({
      message: "Failed to update feedback status.",
    });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(
    `Backend server running on http://localhost:${PORT}`
  );
});