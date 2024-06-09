// path: /auth
const express = require("express");
const userRouter = require("./subRouters/user");
const matchesRouter = require("./subRouters/matches");
const walletRouter = require("./subRouters/wallet");
const stocksRouter = require("./subRouters/stocks");
const notificationsRouter = require("./subRouters/notifications");
const adminRouter = require("./subRouters/admin");
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
