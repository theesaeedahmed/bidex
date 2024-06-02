// server.js
require("dotenv").config();
require("./db/config");
const express = require("express");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use routes
app.use("/", indexRouter);
app.use("/api/users", userRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
