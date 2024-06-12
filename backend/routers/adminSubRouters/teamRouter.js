// /auth/admin/team
const express = require("express");
const {
  createTeam,
  deleteTeam,
  updateTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
  getAllTeams,
} = require("../../controllers/teamController");
const router = express.Router();

// /auth/admin/team/all
router.get("/all", getAllTeams);

// /auth/admin/team/create
router.post("/create", createTeam);

// /auth/admin/team/update
router.put("/update", updateTeam);

// /auth/admin/team/players/add
router.put("/players/add", addPlayerToTeam);

// /auth/admin/team/players/remove
router.put("/players/remove", removePlayerFromTeam);

// /auth/admin/team/delete/:id
router.delete("/delete/:id", deleteTeam);

module.exports = router;
