const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Goal name is required"],
      trim: true,
    },

    target: {
      type: Number,
      required: [true, "Target amount is required"],
      min: [1, "Target must be greater than zero"],
    },

    saved: {
      type: Number,
      default: 0,
      min: [0, "Saved amount cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

savingsGoalSchema.pre("validate", function () {
  if (this.saved > this.target) {
    this.invalidate(
      "saved",
      "Saved amount cannot exceed the target amount"
    );
  }
});

module.exports = mongoose.model(
  "SavingsGoal",
  savingsGoalSchema
);