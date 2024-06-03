// path: /auth
const express = require("express");
const router = express.Router();

// Middleware for /auth/api
router.use((req, res, next) => {
  console.log("Middleware for /auth/api");
  next();
});

// Define your /auth/api routes here
router.get("/test", (req, res) => {
  res.send("Test route for /auth/api");
});

module.exports = router;
