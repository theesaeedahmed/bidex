const Player = require("../models/Player");
const Team = require("../models/Team");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { validateUserSession } = require("../utils/functions");

// /auth/admin/player/create
const createPlayer = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { name } = req.body;

    const player_data = { name };

    const new_player = new Player(player_data);
    await new_player.save();

    res.status(200).json({ success: "true", player: new_player });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/player/update
const updatePlayer = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { playerId: player_id, name } = req.body;

    if (!player_id || !name) {
      throw new CustomError("Need playerId and name in req body", 400);
    }

    const updated_player = await Player.findByIdAndUpdate(
      player_id,
      { name },
      { new: true }
    );

    res.status(200).json({
      success: "true",
      message: "Player name updated successfully",
      newName: updated_player.name,
    });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/player/update/team
const updateTeam = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { playerId: player_id, newTeamId: new_team_id } = req.body;

    if (!player_id || !new_team_id) {
      throw new CustomError("Need playerId and newTeamId in req body.", 400);
    }

    const player = await Player.findById(player_id);

    if (!player) {
      throw new CustomError("Player not found.", 404);
    }

    const new_team = await Team.findById(new_team_id);

    if (!new_team) {
      throw new CustomError("Team not found.", 404);
    }

    if (!player.teamId) {
      player.teamId = new_team_id;
      new_team.players.push(player_id);

      await player.save();
      await new_team.save();
    } else {
      const prev_team_id = player.teamId;
      if (prev_team_id.toString() === new_team_id.toString()) {
        throw new CustomError("Player is already in this team.", 400);
      }
      player.teamId = new_team_id;
      new_team.players.push(player_id);

      const prev_team = await Team.findById(prev_team_id);
      const updated_prev_team_players = [];
      prev_team.players.forEach((team_player_id) => {
        if (team_player_id !== player_id) {
          updated_prev_team_players.push(team_player_id);
        }
      });
      prev_team.players = updated_prev_team_players;

      await player.save();
      await new_team.save();
      await prev_team.save();
    }

    res.status(200).json({
      success: "true",
      message: "Player team updated successfully",
      player,
    });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/player/delete/:id
const deletePlayer = asyncErrorHandler(async (req, res, next) => {
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
      throw new CustomError("need id in url / req params", 400);
    }

    const deleted_player = await Player.findByIdAndDelete(id);

    if (!deleted_player) {
      throw new CustomError("Player not found", 404);
    }

    res.status(200).json({
      success: "true",
      message: `Deleted player: ${deleted_player.name}`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { createPlayer, updatePlayer, updateTeam, deletePlayer };
