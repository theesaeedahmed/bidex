// path: /api
const express = require("express");
const userRouter = require("./subRoutes/user");
const matchesRouter = require("./subRoutes/matches");
const router = express.Router();

router.use("/user", userRouter);
router.use("/matches", matchesRouter);

module.exports = router;
