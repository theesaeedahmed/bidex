// /auth/admin/player
const express = require("express");
const {
  createPlayer,
  deletePlayer,
  updatePlayer,
  updateTeam,
} = require("../../controllers/playerController");
const router = express.Router();

// /auth/admin/player/create
router.post("/create", createPlayer);

// /auth/admin/player/update
router.put("/update", updatePlayer);

// /auth/admin/player/update/team
router.put("/update", updateTeam);

// /auth/admin/player/delete/:id
router.delete("/delete/:id", deletePlayer);

module.exports = router;
