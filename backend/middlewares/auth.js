const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CustomError = require("../utils/CustomError");
const access_token_secret = process.env.ACCESS_TOKEN_SECRET;

function auth(req, res, next) {
  const auth_header = req.headers["authorization"];
  const access_token = auth_header && auth_header.split(" ")[1];

  try {
    if (!access_token) {
      throw new CustomError("No access token provided.", 401);
    }

    const session = jwt.verify(access_token, access_token_secret);

    if (!session || !session.id) {
      throw new CustomError("Invalid access token", 401);
    }

    req.session = session;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = auth;
