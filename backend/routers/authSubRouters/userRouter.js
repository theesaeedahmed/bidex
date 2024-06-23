// /user
const express = require("express");
const auth = require("../../middlewares/auth");
const {
  logout,
  update,
  generateAccessTokenFromRefreshToken,
  userProfile,
} = require("../../controllers/userController");
const router = express.Router();

// /auth/user/generate-token
router.post("/generate-token", generateAccessTokenFromRefreshToken);

// /auth/user/logout
router.post("/logout", logout);

// /auth/user/profile
router.get("/profile", userProfile);

// /auth/user/update
router.put("/profile/update", auth, update);

module.exports = router;
