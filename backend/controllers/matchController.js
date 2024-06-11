const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { validateUserSession } = require("../utils/functions");

/**
 * UNAUTHORIZED ROUTES
 */

//  /api/matches/upcoming
const fetchUpcomingMatches = asyncErrorHandler(async (req, res, next) => {});

//  /api/matches/live
const fetchLiveMatches = asyncErrorHandler(async (req, res, next) => {});

//  /api/matches/completed
const fetchCompletedMatches = asyncErrorHandler(async (req, res, next) => {});

//  /api/matches/search
const searchMatch = asyncErrorHandler(async (req, res, next) => {});

/**
 * AUTHORIZED ROUTES
 */

// /auth/admin/matches/add
const addNewMatch = asyncErrorHandler(async (req, res, next) => {});

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
