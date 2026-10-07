const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const Transaction = require("./models/Transaction");

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

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Financial Habit Builder backend is running!",
  });
});

// ADD TRANSACTION
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
    const transaction =
      await Transaction.findByIdAndUpdate(
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
    const transaction =
      await Transaction.findByIdAndDelete(
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
// Start server
app.listen(PORT, () => {
  console.log(
    `Backend server running on http://localhost:${PORT}`
  );
});