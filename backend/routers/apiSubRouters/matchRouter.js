// /matches
const express = require("express");
const {
  fetchUpcomingMatches,
  fetchLiveMatches,
  fetchCompletedMatches,
  searchMatch,
} = require("../../controllers/matchController");
const router = express.Router();

// retrieve a list of upcoming matches
router.get("/upcoming", fetchUpcomingMatches);

// retrieve a list of live matches
router.get("/live", fetchLiveMatches);

// retrieve a list of completed matches
router.get("/completed", fetchCompletedMatches);

// search a specific match
router.get("/search", searchMatch);

module.exports = router;
