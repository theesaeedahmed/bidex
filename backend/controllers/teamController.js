const Player = require("../models/Player");
const Team = require("../models/Team");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { validateUserSession } = require("../utils/functions");

// /auth/admin/team/all
const getAllTeams = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const all_teams = await Team.find();

    res.status(200).json({ success: "true", teams: all_teams });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/team/create
const createTeam = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { name, players } = req.body;

    const team_data = { name, players: [] };

    if (players && Array.isArray(players) && players.length > 0) {
      team_data.players = players;
    }

    const new_team = new Team(team_data);
    await new_team.save();

    if (new_team.players.length > 0) {
      await new_team.populate({ path: "players", model: "Player" });
    }

    res.status(200).json({ success: "true", team: new_team });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/team/update
const updateTeam = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { teamId: team_id, name } = req.body;

    if (!team_id || !name) {
      throw new CustomError("teamId and name are required.", 400);
    }

    const updated_team = await Team.findByIdAndUpdate(
      team_id,
      { name },
      { new: true }
    );

    if (!updated_team) {
      throw new CustomError("Team not found", 404);
    }

    res.status(200).json({
      success: "true",
      message: "team name updated",
      newName: updated_team.name,
    });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/team/players/add
const addPlayerToTeam = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { teamId: team_id, playerId: player_id } = req.body;

    if (!team_id || !player_id) {
      throw new CustomError("teamId and playerId are required.", 400);
    }

    const team = await Team.findById(team_id);
    if (!team) {
      throw new CustomError("Team not found", 404);
    }

    const player = await Player.findById(player_id);
    if (!player) {
      throw new CustomError("Player not found", 404);
    }

    team.players.push(player_id);
    await team.save();

    res
      .status(200)
      .json({ success: true, message: "Player added to team successfully" });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/team/players/remove
const removePlayerFromTeam = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { teamId, playerId } = req.body;

    if (!teamId || !playerId) {
      throw new CustomError("teamId and playerId are required.", 400);
    }

    const team = await Team.findById(teamId);
    if (!team) {
      throw new CustomError("Team not found", 404);
    }

    const index = team.players.indexOf(playerId);
    if (index === -1) {
      throw new CustomError("Player not found in the team", 404);
    }

    team.players.splice(index, 1);
    await team.save();

    res.status(200).json({
      success: true,
      message: "Player removed from team successfully",
    });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/team/delete/:id
const deleteTeam = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { id } = req.params;

    if (!id) {
      throw new CustomError("Team ID is required.", 400);
    }

    const team = await Team.findByIdAndDelete(id);

    if (!team) {
      throw new CustomError("Team not found", 404);
    }

    res
      .status(200)
      .json({ success: true, message: "Team deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getAllTeams,
  createTeam,
  updateTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
  deleteTeam,
};
