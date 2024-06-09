// server.js
require("dotenv").config();
require("./db/config");
const express = require("express");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");
const indexRouter = require("./routers/indexRouter");
const apiRouter = require("./routers/apiRouter");
const authRouter = require("./routers/authRouter");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request body
app.use(express.json());

// Routes
app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/auth", auth, authRouter);

// Error Handler Middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
