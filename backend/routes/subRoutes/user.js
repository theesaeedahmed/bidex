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

/**
 * UNAUTHORIZED ROUTES
 */

// /api/user/generate-token
router.get("/generate-token", generateAccessTokenFromRefreshToken);

// /api/user/register
router.post("/register", register);

// /api/user/login
router.post("/login", login);

/**
 * AUTHORIZED ROUTES
 */

// /auth/user/logout
router.post("/logout", logout);

// /auth/user/update
router.post("/update", auth, update);

module.exports = router;
