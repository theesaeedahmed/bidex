// path: /auth
const express = require("express");
const userRouter = require("./subRouters/userRouter");
const matchesRouter = require("./subRouters/matchRouter");
const walletRouter = require("./subRouters/walletRouter");
const stocksRouter = require("./subRouters/stockRouter");
const notificationsRouter = require("./subRouters/notificationRouter");
const adminRouter = require("./subRouters/adminRouter");
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

// /auth/admin
router.use("/admin", adminRouter);

module.exports = router;
