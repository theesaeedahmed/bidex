// path: /auth
const express = require("express");
const userRouter = require("./subRoutes/user");
const matchesRouter = require("./subRoutes/matches");
const walletRouter = require("./subRoutes/wallet");
const stocksRouter = require("./subRoutes/stocks");
const notificationsRouter = require("./subRoutes/notifications");
const adminRouter = require("./subRoutes/admin");
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
