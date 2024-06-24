const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { validateUserSession } = require("../utils/functions");
const Wallet = require("../models/Wallet");

// /auth/wallet
const getUserWallet = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const user = await validateUserSession(req.session.id, access_token);

    const user_wallet = await Wallet.findOne({ userId: user._id }).populate(
      "transactions"
    );

    if (!user_wallet) {
      throw new CustomError("User wallet doesn't exist.", 404);
    }

    res.status(200).json({ success: "true", wallet: user_wallet });
  } catch (error) {
    next(error);
  }
});

module.exports = { getUserWallet };
