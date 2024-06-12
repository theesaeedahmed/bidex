// path: /auth
const express = require("express");
const userRouter = require("./authSubRouters/userRouter");
const matchesRouter = require("./authSubRouters/matchRouter");
const walletRouter = require("./authSubRouters/walletRouter");
const stocksRouter = require("./authSubRouters/stockRouter");
const notificationsRouter = require("./authSubRouters/notificationRouter");
const adminRouter = require("./authSubRouters/adminRouter");
const transactionRouter = require("./authSubRouters/transactionRouter");
const router = express.Router();

// /auth/user
router.use("/user", userRouter);

// /auth/matches
router.use("/matches", matchesRouter);

// /auth/wallet
router.use("/wallet", walletRouter);

// /auth/stocks
router.use("/stocks", stocksRouter);

// /auth/notifications
router.use("/notifications", notificationsRouter);

// /auth/transaction
router.use("/admin", transactionRouter);

// /auth/admin
router.use("/admin", adminRouter);

module.exports = router;
