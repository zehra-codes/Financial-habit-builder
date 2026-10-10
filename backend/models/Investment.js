const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Investment name is required"],
      trim: true,
    },

    type: {
      type: String,
      required: [true, "Investment type is required"],
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Investment amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Investment", investmentSchema);