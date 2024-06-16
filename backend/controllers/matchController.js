const Match = require("../models/Match");
const Stock = require("../models/Stock");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { validateUserSession } = require("../utils/functions");

const didWin = (stock, match) => {
  const player_id = stock.playerId;
  const player_points = match.players.find(
    (match_player) => match_player.id.toString() === player_id.toString()
  );

  const type = stock.type;

  const check = player_points.points > player_points.biddingPoints;
  if (type === "yes") {
    return { did_win: check, bid_multiplier: check ? 2 : 0 };
  } else if (type === "no") {
    return { did_win: !check, bid_multiplier: !check ? 2 : 0 };
  } else if (type === "multibagger") {
    let max_points = -999999;
    let max_points_players = [];

    match.players.forEach((match_player) => {
      if (match_player.points > max_points) {
        max_points = match_player.points;
        max_points_players = [match_player.id];
      } else if (match_player.points === max_points) {
        max_points_players.push(match_player.id);
      }
    });

    if (max_points_players.length === 0) {
      throw new CustomError("No players have max point.", 400);
    }

    const bidded_player = max_points_players.find(
      (max_points_player) =>
        max_points_player.id.toString() === player_id.toString()
    );

    return {
      did_win: bidded_player ? true : false,
      bid_multiplier: bidded_player ? 5 : 0,
    };
  } else {
    return { did_win: false, bid_multiplier: 0 };
  }
};

/**
 * UNAUTHORIZED ROUTES
 */

//  /api/matches/upcoming
const fetchUpcomingMatches = asyncErrorHandler(async (req, res, next) => {
  try {
    const upcomingMatches = await Match.find({ status: "upcoming" }).populate({
      path: "players.id",
      model: "Player",
    });
    res.status(200).json({ matches: upcomingMatches });
  } catch (error) {
    next(error);
  }
});

//  /api/matches/live
const fetchLiveMatches = asyncErrorHandler(async (req, res, next) => {
  try {
    const liveMatches = await Match.find({ status: "live" }).populate({
      path: "players.id",
      model: "Player",
    });
    res.status(200).json({ matches: liveMatches });
  } catch (error) {
    next(error);
  }
});

//  /api/matches/completed
const fetchCompletedMatches = asyncErrorHandler(async (req, res, next) => {
  try {
    const completedMatches = await Match.find({ status: "completed" }).populate(
      {
        path: "players.id",
        model: "Player",
      }
    );
    res.status(200).json({ matches: completedMatches });
  } catch (error) {
    next(error);
  }
});

//  /api/matches/search?name=name&startDate=date&endDate=date
const searchMatch = asyncErrorHandler(async (req, res, next) => {
  const {
    name,
    startDate: start_date,
    endDate: end_date,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    let search_criteria = {};

    if (!name && !start_date && !end_date) {
      throw new CustomError(
        "Need name or startDate or endDate to search for matches"
      );
    }

    if (name) {
      search_criteria.name = new RegExp(name, "i");
    }

    if (start_date || end_date) {
      search_criteria.date = {};
      if (start_date) {
        search_criteria.date.$gte = new Date(start_date);
      }
      if (end_date) {
        search_criteria.date.$lte = new Date(end_date);
      }
    }

    const skip = (page - 1) * limit;

    const searched_matches = await Match.find(search_criteria)
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: "players.id",
        model: "Player",
      });

    res.status(200).json({ success: true, searchedMatches: searched_matches });
  } catch (error) {
    next(error);
  }
});

/**
 * AUTHORIZED ROUTES
 */

// /auth/admin/matches/update/status
const updateMatchStatus = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { matchId: match_id, status } = req.body;

    const valid_statuses = ["upcoming", "live", "completed"];

    if (!valid_statuses.includes(status)) {
      throw new CustomError(`Invalid status value: ${status}`, 400);
    }

    const match = await Match.findById(match_id);

    if (!match) {
      throw new CustomError(`No match found`, 404);
    }

    match.status = status;

    if (status === "completed") {
      const stocks = await Stock.find({ matchId: match_id }).populate({
        path: "userId",
        select: "_id walletId",
      });

      if (stocks && Array.isArray(stocks) && stocks.length > 0) {
        const walletIds = stocks.map((stock) => stock.userId.walletId);

        // Fetch all wallets in a single query
        const wallets = await Wallet.find({ _id: { $in: walletIds } });

        // Create a map of wallet IDs to wallet documents
        const walletMap = wallets.reduce((map, wallet) => {
          map[wallet._id.toString()] = wallet;
          return map;
        }, {});

        // Update wallets and create transactions within stocks.map
        await Promise.all(
          stocks.map(async (stock) => {
            const wallet = walletMap[stock.userId.walletId.toString()];
            const { did_win, bid_multiplier } = didWin(stock, match);

            if (did_win) {
              stock.status = "won";

              const transaction_data = {
                userId: wallet.userId,
                amount: stock.totalInvestment * bid_multiplier,
                type: "won_bet",
              };

              wallet.unsettledBalance.winnings =
                (wallet.unsettledBalance.winnings || 0) +
                stock.totalInvestment * bid_multiplier;

              await Transaction.create(transaction_data);
              await wallet.save();
            } else {
              stock.status = "lost";
            }

            await stock.save();
          })
        );
      }
    }

    await match.save();

    res
      .status(200)
      .json({ success: true, message: "Match status updated successfully" });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/matches/create
const createMatch = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { name, date, status, players, teams } = req.body;

    if (
      !name ||
      !date ||
      !players ||
      !Array.isArray(players) ||
      !(players.length === 22) ||
      !teams ||
      !Array.isArray(teams) ||
      !(teams.length === 2)
    ) {
      throw new CustomError(
        "Match name, date, exactly 22 players and exactly 2 teams are required",
        400
      );
    }

    const bidding_points_empty_player = players.find(
      (player) => !player.biddingPoints
    );

    if (bidding_points_empty_player) {
      throw new CustomError(
        "You need to set the bidding points for each player participating in the match. The bidding point must be greater than 1."
      );
    }

    const match_status = status || "upcoming";

    const new_match = new Match({
      name,
      date,
      status: match_status,
      teams,
      players,
    });

    await new_match.save();

    await new_match.populate({
      path: "players.id",
      model: "Player",
    });

    res
      .status(201)
      .json({ message: "Match created successfully", match: new_match });
  } catch (error) {
    next(error);
  }
});

// /auth/admin/matches/delete/:id
const deleteMatch = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const admin = await validateUserSession(
      req.session.id,
      access_token,
      false,
      true
    );

    const { id } = req.query;

    if (!id) {
      throw new Error("Need match id in url / req params", 400);
    }
    const match = await Match.findByIdAndDelete(id);

    if (!match) {
      throw new CustomError(`No match found`, 404);
    }

    res
      .status(200)
      .json({ success: true, message: "Match deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  fetchUpcomingMatches,
  fetchLiveMatches,
  fetchCompletedMatches,
  searchMatch,
  createMatch,
  deleteMatch,
  updateMatchStatus,
};
