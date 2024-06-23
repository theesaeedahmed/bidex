// server.js
require("dotenv").config();
require("./config/mongodb");
require("./config/cloudinary");
const express = require("express");
const cors = require("cors");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");
const indexRouter = require("./routers/indexRouter");
const apiRouter = require("./routers/apiRouter");
const authRouter = require("./routers/authRouter");

const app = express();
const port = process.env.PORT || 3000;

// Set up cors
const corsOptions = {
  origin: "http://localhost:5173", // your frontend's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

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
