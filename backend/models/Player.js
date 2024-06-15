const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  },
  { timestamps: true }
);

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
