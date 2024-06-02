const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    matchName: {
      type: String,
      required: true,
    },
    matchDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
    players: [
      {
        playerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Player",
        },
        initialPoints: { type: Number, required: true },
        bettingPoints: { typs: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
