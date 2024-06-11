// /user
const express = require("express");
const auth = require("../../middlewares/auth");
const { register, login } = require("../../controllers/userController");
const router = express.Router();

// /api/user/register
router.post("/register", register);

// /api/user/login
router.post("/login", login);

module.exports = router;
