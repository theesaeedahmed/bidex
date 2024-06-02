// routes/user.js
const express = require("express");
const auth = require("../middlewares/auth");
const {
  register,
  login,
  logout,
  generateAccessTokenFromRefreshToken,
} = require("../controllers/userController");
const router = express.Router();

router.get("/generate-token", generateAccessTokenFromRefreshToken);

// Register a new user
router.post("/register", register);

// Login a user
router.post("/login", login);

// Logout a user (client-side, remove token)
router.post("/logout", auth, logout);

module.exports = router;
