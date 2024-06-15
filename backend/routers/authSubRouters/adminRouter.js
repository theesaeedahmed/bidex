// auth/admin/
const express = require("express");
const router = express.Router();
const matchRouter = require("../adminSubRouters/matchRouter");
const playerRouter = require("../adminSubRouters/playerRouter");
const teamRouter = require("../adminSubRouters/teamRouter");
const transactionRouter = require("../adminSubRouters/transactionRouter");

// /auth/admin/matches
router.use("/matches", matchRouter);

// /auth/admin/player
router.use("/player", playerRouter);

// /auth/admin/team
router.use("/team", teamRouter);

// /auth/admin/transactions
router.use("/transactions", transactionRouter);

module.exports = router;
