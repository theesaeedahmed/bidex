// path: /api
const express = require("express");
const userRouter = require("./subRouters/user");
const matchesRouter = require("./subRouters/matches");
const router = express.Router();

router.use("/user", userRouter);
router.use("/matches", matchesRouter);

module.exports = router;
