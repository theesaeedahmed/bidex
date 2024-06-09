// path: /api
const express = require("express");
const userRouter = require("./subRouters/userRouter");
const matchesRouter = require("./subRouters/matchRouter");
const router = express.Router();

router.use("/user", userRouter);
router.use("/matches", matchesRouter);

module.exports = router;
