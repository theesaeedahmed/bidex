// routes/index.js
const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();

// Define a route for the home page
router.get("/", (req, res) => {
  res.send("Hello, World!");
});

router.get("/test-auth", auth, (req, res) => {
  res.json({ message: "Hello, World!", id: req.session.id });
});

// Export the router
module.exports = router;
