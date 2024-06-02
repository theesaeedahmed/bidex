// config.js
const mongoose = require("mongoose");

const mongo_uri =
  process.env.MONGO_URI || "mongodb://localhost:27017/myexpressapp";

// Connect to DB
mongoose
  .connect(mongo_uri)
  .then(() => {
    console.log("MongoDB connected...");
    // Define indexes after connecting to MongoDB
    const db = mongoose.connection;
    db.once("open", () => {
      // Define indexes on collections
      db.collection("users").createIndex({ email: 1, username: 1 });
      db.collection("wallets").createIndex({ userId: 1 });
      db.collection("transactions").createIndex({ userId: 1, date: -1 });
      db.collection("matches").createIndex({
        matchDate: 1,
        status: 1,
        matchName: 1,
      });
      db.collection("stocks").createIndex({
        matchId: 1,
        playerId: 1,
        userId: 1,
      });
      db.collection("notifications").createIndex({ userId: 1, date: -1 });
    });
  })
  .catch((err) => console.log(err));
