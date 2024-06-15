// /auth/transactions
const express = require("express");
const {
  deposit,
  withdraw,
  buyStock,
} = require("../../controllers/transactionController");
const router = express.Router();
const upload = require("../../middlewares/multer");

// /auth/transactions/deposit
router.post("/deposit", upload.single("transaction"), deposit);

// /auth/transactions/withdraw
router.post("/withdraw", withdraw);

// /auth/transactions/buy_stock
router.post("/buy_stock", buyStock);

module.exports = router;
