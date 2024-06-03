// path: /api
const express = require("express");
const userRouter = require("./subRoutes/user");
const matchesRouter = require("./subRoutes/matches");
const walletRouter = require("./subRoutes/wallet");
const stocksRouter = require("./subRoutes/stocks");
const notificationsRouter = require("./subRoutes/notifications");
const adminRouter = require("./subRoutes/admin");
const router = express.Router();

// Middleware for /api
router.use((req, res, next) => {
  console.log("Middleware for /api");
  next();
});

// Define your /api routes here
router.get("/test", (req, res) => {
  res.send("Test route for /api");
});

router.use("/api/user", userRouter);
router.use("/api/matches", matchesRouter);
router.use("/api/wallet", walletRouter);
router.use("/api/stocks", stocksRouter);
router.use("/api/notifications", notificationsRouter);
router.use("/api/admin", adminRouter);

module.exports = router;
