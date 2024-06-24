// auth/wallet
const express = require("express");
const { getUserWallet } = require("../../controllers/walletController");
const router = express.Router();

// /auth/wallet
router.get("/", getUserWallet);

module.exports = router;
