const mongoose = require("mongoose");

const unsettledBalanceSchema = new mongoose.Schema(
  {
    deposit: {
      type: Number,
      default: 0,
    },
    withdrawal: {
      type: Number,
      default: 0,
    },
    winnings: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

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
    unsettledBalance: {
      type: unsettledBalanceSchema,
      default: () => ({}), // Ensures that the default value is an object with default values for its fields
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
