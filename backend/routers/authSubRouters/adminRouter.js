// auth/admin/
const express = require("express");
const router = express.Router();
const matchRouter = require("../adminSubRouters/matchRouter");

// router.post('')
router.use("/matches", matchRouter);

module.exports = router;
