const Player = require("../models/Player");
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

module.exports = { createPlayer, updatePlayer, deletePlayer };
