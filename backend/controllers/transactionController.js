const Transaction = require("../models/Transaction");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { validateUserSession } = require("../utils/functions");

// /auth/admin/transactions/accept
const acceptTransaction = asyncErrorHandler(async (req, res, next) => {});

// /auth/admin/transactions/reject
const rejectTransaction = asyncErrorHandler(async (req, res, next) => {});

module.exports = { acceptTransaction, rejectTransaction };
