const Transaction = require("../models/Transaction");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { validateUserSession } = require("../utils/functions");
const { uploadOnCloudinary } = require("../config/cloudinary");
const fs = require("fs");
const Wallet = require("../models/Wallet");
const Stock = require("../models/Stock");
const Match = require("../models/Match");
const User = require("../models/User");

// /auth/transactions/deposit
const deposit = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const user = await validateUserSession(req.session.id, access_token);

    const { amount, utr } = req.body;

    if (!amount || !utr) {
      throw new CustomError(
        "Transaction amount, type and screenshot are required.",
        400
      );
    }

    if (!req.file) {
      throw new CustomError("Transaction image not found.", 500);
    }

    const user_wallet = await Wallet.findById(user.walletId);

    const local_file_path = `${req.file.destination}/${req.file.filename}`;

    if (!user_wallet) {
      fs.unlinkSync(local_file_path);
      throw new CustomError("Wallet not found.", 404);
    }

    const response = await uploadOnCloudinary(
      "transaction",
      local_file_path,
      req.file.filename
    );
    const transaction_screenshot_url = response.secure_url;

    fs.unlinkSync(local_file_path);

    const transaction_data = {
      userId: user._id,
      amount,
      type: "deposit",
      utr,
      screenshot: transaction_screenshot_url,
    };

    const transaction = await Transaction.create(transaction_data);
    if (!transaction) {
      throw new CustomError("Error while creating transaction.", 500);
    }

    user_wallet.unsettledBalance.deposit =
      user_wallet.unsettledBalance.deposit + amount;
    user_wallet.transactions.push(transaction._id);
    const updated_wallet = await user_wallet.save();

    res.json({
      success: true,
      message:
        "Deposit Request made successfully. Admin will review this request shortly.",
      transaction,
    });
  } catch (error) {
    next(error);
  }
});

// /auth/transactions/withdraw
const withdraw = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const user = await validateUserSession(req.session.id, access_token);

    const { amount } = req.body;

    if (!amount) {
      throw new CustomError(
        "Amount is need in order to make a withdrawal request.",
        400
      );
    }

    const user_wallet = await Wallet.findById(user.walletId);

    if (!user_wallet) {
      throw new CustomError("Wallet not found", 404);
    }

    if (user_wallet.balance < amount) {
      throw new CustomError("Insufficient balance", 400);
    }

    const new_transaction = {
      userId: user._id,
      amount,
      type: "withdrawal",
    };

    const transaction = await Transaction.create(new_transaction);

    user_wallet.transactions.push(transaction._id);
    user_wallet.unsettledBalance.withdrawal =
      user_wallet.unsettledBalance.withdrawal + amount;
    user_wallet.balance = user_wallet.balance - amount;
    const updated_wallet = await user_wallet.save();

    res.json({
      success: true,
      message:
        "Withdrawal Request made successfully. Admin would review this request shortly.",
      transaction,
    });
  } catch (error) {
    next(error);
  }
});

// /auth/transactions/buy_stock
const buyStock = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const user = await validateUserSession(req.session.id, access_token);

    const {
      matchId: match_id,
      playerId: player_id,
      type,
      numberOfShare: number_of_shares,
      pricePerShare: price_per_share,
    } = req.body;

    if (
      !match_id ||
      !player_id ||
      !type ||
      !number_of_shares ||
      !price_per_share
    ) {
      throw new CustomError(
        "Match Id, Player Id, Type of stock (yes/no), Number of shares, price per share are required to buy stocks.",
        400
      );
    }

    const match = await Match.findById(match_id);

    if (!match) {
      throw new CustomError("Match not found.", 404);
    }

    if (match.status !== "live") {
      throw new CustomError("Match isn't live to buy stocks yet.", 400);
    }

    const user_wallet = await Wallet.findById(user.walletId);

    if (!user_wallet) {
      throw new CustomError("Wallet not found.", 404);
    }

    const total_investment = number_of_shares * price_per_share;

    if (total_investment > user_wallet.balance) {
      throw new CustomError("Insufficient balance.", 400);
    }

    const new_transaction = {
      userId: user._id,
      amount: total_investment,
      type: "buy_stock",
      status: "completed",
    };

    const new_stock = {
      matchId: match_id,
      playerId: player_id,
      userId: user._id,
      type,
      numberOfShares: number_of_shares,
      pricePerShare: price_per_share,
      totalInvestment: total_investment,
    };

    const balance = user_wallet.balance;

    user_wallet.balance = balance - total_investment;

    const transaction = await Transaction.create(new_transaction);

    if (!transaction) {
      throw new CustomError("Error while creating a transaction", 500);
    }

    user_wallet.transactions.push(transaction._id);

    const stock = await Stock.create(new_stock);

    if (!stock) {
      await Transaction.findByIdAndDelete(transaction._id);

      throw new CustomError("Error while alloting stock", 500);
    }

    const updated_wallet = await user_wallet.save();

    if (updated_wallet.balance !== balance - total_investment) {
      await Transaction.findByIdAndDelete(transaction._id);

      await Stock.findByIdAndDelete(stock._id);

      const transactions = [];
      updated_wallet.transactions.forEach((wallet_transaction_id) => {
        if (transaction._id.toString() !== wallet_transaction_id.toString()) {
          transactions.push(transaction._id);
        }
      });
      updated_wallet.balance = balance;
      updated_wallet.transactions = transactions;
      await updated_wallet.save();

      throw new CustomError("Error while updating user wallet balance", 500);
    }

    res.json({
      message: "Stocks bought successfully.",
      transaction,
      stock,
    });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/transactions/accept
const acceptTransaction = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { transactionId: transaction_id } = req.body;

    if (!transaction_id) {
      throw new CustomError(
        "Transaction id is required to accept a transaction.",
        400
      );
    }

    const transaction = await Transaction.findById(transaction_id);
    if (!transaction) {
      throw new CustomError("Transaction not found", 404);
    }

    if (transaction.status === "completed" || transaction.status === "failed") {
      throw CustomError("Transaction has already been resolved.", 400);
    }

    const user_id = transaction.userId;
    const user = await User.findById(user_id);
    if (!user) {
      throw new CustomError("User not found.", 404);
    }

    const wallet_id = user.walletId;
    const wallet = await Wallet.findById(wallet_id);
    if (!wallet) {
      throw new CustomError("User wallet not found.", 404);
    }

    if (transaction.type === "deposit") {
      wallet.balance = wallet.balance + transaction.amount;
      wallet.unsettledBalance.deposit =
        wallet.unsettledBalance.deposit - transaction.amount;

      transaction.status = "completed";
    } else if (
      transaction.type === "withdrawal" ||
      transaction.type === "won_bet"
    ) {
      if (transaction.type === "withdrawal") {
        wallet.unsettledBalance.withdrawal =
          wallet.unsettledBalance.withdrawal - transaction.amount;
      } else {
        wallet.unsettledBalance.winnings =
          wallet.unsettledBalance.winnings - transaction.amount;
        wallet.balance = wallet.balance + transaction.amount;
      }

      if (!utr) {
        throw new CustomError(
          "UTR number is required to approve withdrawal and won bet transactions",
          400
        );
      }

      if (!req.file) {
        throw new CustomError("Transaction image not found.", 500);
      }

      const local_file_path = `${req.file.destination}/${req.file.filename}`;

      const response = await uploadOnCloudinary(
        "transaction",
        local_file_path,
        req.file.filename
      );
      const transaction_screenshot_url = response.secure_url;
      fs.unlinkSync(local_file_path);

      transaction.utr = utr;
      transaction.screenshot = transaction_screenshot_url;
      transaction.status = "completed";
    }

    await transaction.save();
    await wallet.save();

    res.json({ message: "Transaction approved." });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/transactions/reject
const rejectTransaction = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { transactionId: transaction_id } = req.body;

    if (!transaction_id) {
      throw new CustomError(
        "Transaction id is required to reject a transaction.",
        400
      );
    }

    const transaction = await Transaction.findById(transaction_id);
    if (!transaction) {
      throw new CustomError("Transaction not found", 404);
    }

    if (transaction.status === "completed" || transaction.status === "failed") {
      throw CustomError("Transaction has already been resolved.", 400);
    }

    const user_id = transaction.userId;
    const user = await User.findById(user_id);
    if (!user) {
      throw new CustomError("User not found.", 404);
    }

    const wallet_id = user.walletId;
    const wallet = await Wallet.findById(wallet_id);
    if (!wallet) {
      throw new CustomError("User wallet not found.", 404);
    }

    if (transaction.type === "deposit") {
      wallet.unsettledBalance.deposit =
        wallet.unsettledBalance.deposit - transaction.amount;

      transaction.status = "failed";
    } else if (transaction.type === "withdrawal") {
      wallet.unsettledBalance.withdrawal =
        wallet.unsettledBalance.withdrawal - transaction.amount;
      wallet.balance = wallet.balance + transaction.amount;

      transaction.status = "failed";
    } else if (transaction.type === "won_bet") {
      wallet.unsettledBalance.winnings =
        wallet.unsettledBalance.winnings - transaction.amount;

      transaction.status = "failed";
    }

    await transaction.save();
    await wallet.save();

    res.json({ message: "Transaction rejected." });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/transactions/pending
const fetchPendingTransactions = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { page = 1, limit = 10 } = req.body();
    const skip = (page - 1) * limit;

    const pending_transactions = await Transaction.find({ status: "pending" })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      message: "Pending transactions fetched successfully.",
      pendingTransactions: pending_transactions,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  deposit,
  withdraw,
  buyStock,
  acceptTransaction,
  rejectTransaction,
  fetchPendingTransactions,
};
