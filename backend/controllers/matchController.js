const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { validateUserSession } = require("../utils/functions");

/**
 * UNAUTHORIZED ROUTES
 */

//  /api/matches/upcoming
const fetchUpcomingMatches = asyncErrorHandler(async (req, res, next) => {
  try {
    const upcomingMatches = await Match.find({ status: "upcoming" });
    res.status(200).json({ matches: upcomingMatches });
  } catch (error) {
    next(error);
  }
});

//  /api/matches/live
const fetchLiveMatches = asyncErrorHandler(async (req, res, next) => {
  try {
    const liveMatches = await Match.find({ status: "live" });
    res.status(200).json({ matches: liveMatches });
  } catch (error) {
    next(error);
  }
});

//  /api/matches/completed
const fetchCompletedMatches = asyncErrorHandler(async (req, res, next) => {
  try {
    const completedMatches = await Match.find({ status: "completed" });
    res.status(200).json({ matches: completedMatches });
  } catch (error) {
    next(error);
  }
});

//  /api/matches/search
const searchMatch = asyncErrorHandler(async (req, res, next) => {});

/**
 * AUTHORIZED ROUTES
 */

// /auth/admin/matches/add
const addNewMatch = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const {
      matchName: match_name,
      matchDate: match_date,
      status,
      players,
    } = req.body;
    if (!match_name || !match_date || !players || !Array.isArray(players)) {
      throw new CustomError("Match name, date, and players are required", 400);
    }

    const match_status = status || "upcoming";

    // Create new match from request body
    const new_match = new Match({
      matchName: match_name,
      matchDate: match_date,
      status: match_status,
      players,
    });

    // Save new match
    await new_match.save();

    res
      .status(201)
      .json({ message: "Match added successfully", match: new_match });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/matches/delete/:id
const deleteMatch = asyncErrorHandler(async (req, res, next) => {});

module.exports = {
  fetchUpcomingMatches,
  fetchLiveMatches,
  fetchCompletedMatches,
  searchMatch,
  addNewMatch,
  deleteMatch,
};
