// /auth/admin/matches
const express = require("express");
const {
  createMatch,
  deleteMatch,
  updateMatchStatus,
  updatePlayerPoints,
} = require("../../controllers/matchController");
const router = express.Router();

// /auth/admin/matches/create
router.post("/create", createMatch);

// /auth/admin/matches/update/status
router.put("/update/status", updateMatchStatus);

// /auth/admin/matches/update/player_points
router.put("/update/player_points", updatePlayerPoints);

// /auth/admin/matches/delete/:id
router.delete("/delete/:id", deleteMatch);

module.exports = router;
