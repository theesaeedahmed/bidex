// api/user
const express = require("express");
const auth = require("../../middlewares/auth");
const {
  register,
  login,
  logout,
  update,
  generateAccessTokenFromRefreshToken,
} = require("../../controllers/userController");
const router = express.Router();

router.get("/generate-token", generateAccessTokenFromRefreshToken);

// Register a new user
router.post("/register", register);

// Login a user
router.post("/login", login);

// Logout a user (client-side, remove token)
router.post("/logout", auth, logout);

router.post("/update", auth, update);

module.exports = router;
