// /auth/admin/transactions
const express = require("express");
const {
  acceptTransaction,
  rejectTransaction,
} = require("../../controllers/transactionController");
const upload = require("../../middlewares/multer");
const router = express.Router();

// /auth/admin/transactions/accept
router.put("/accept", upload.single("transaction"), acceptTransaction);

// /auth/admin/transactions/reject
router.put("/reject", rejectTransaction);

module.exports = router;
