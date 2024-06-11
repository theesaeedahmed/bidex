// path: /api
const express = require("express");
const userRouter = require("./apiSubRouters/userRouter");
const matchesRouter = require("./apiSubRouters/matchRouter");
const router = express.Router();

router.use("/user", userRouter);
router.use("/matches", matchesRouter);

module.exports = router;
