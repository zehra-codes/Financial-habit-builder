const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
    },

    type: {
      type: String,
      required: [true, "Asset type is required"],
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Asset amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Asset", assetSchema);