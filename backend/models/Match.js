const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
    teams: [
      // array of team ids (only 2 team ids permitted)
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      },
    ],
    players: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Player",
          required: true,
        },
        points: { type: Number, default: 0 },
        biddingPoints: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
