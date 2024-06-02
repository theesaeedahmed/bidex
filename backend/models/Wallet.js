const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User schema
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction", // Reference to Transaction schema
      },
    ],
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
