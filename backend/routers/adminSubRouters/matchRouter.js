// /auth/admin/matches
const express = require("express");
const {
  createMatch,
  deleteMatch,
  updateMatchStatus,
} = require("../../controllers/matchController");
const router = express.Router();

// /auth/admin/matches/create
router.post("/create", createMatch);

// /auth/admin/matches/update/status
router.put("/update/status", updateMatchStatus);

// /auth/admin/matches/delete/:id
router.delete("/delete/:id", deleteMatch);

module.exports = router;
