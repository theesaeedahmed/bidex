// server.js
require("dotenv").config();
require("./db/config");
const express = require("express");
const auth = require("./middlewares/auth");
const getAdminData = require("./middlewares/getAdminData");
const getUserData = require("./middlewares/getUserData");
const errorHandler = require("./middlewares/errorHandler");
const indexRouter = require("./routes/indexRouter");
const apiRouter = require("./routes/apiRouter");
const authRouter = require("./routes/authRouter");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request body
app.use(express.json());

// Middlewares to authenticate user and get user/admin information
app.use("/auth", auth);
app.use("/auth/admin", getAdminData);
app.use("/auth/api", getUserData);

// Routes
app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/auth", authRouter);

// Error Handler Middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
