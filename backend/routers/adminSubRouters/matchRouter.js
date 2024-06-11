// /admin/matches
const express = require("express");
const {
  addNewMatch,
  deleteMatch,
} = require("../../controllers/matchController");
const router = express.Router();

// add a new cricket match, admin access only
router.post("/add", addNewMatch);

// remove an old cricket match, admin access only
router.delete("/delete/:id", deleteMatch);

module.exports = router;
