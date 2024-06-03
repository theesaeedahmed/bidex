const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CustomError = require("../utils/CustomError");
const access_token_secret = process.env.ACCESS_TOKEN_SECRET;

function auth(req, res, next) {
  const auth_header = req.headers["authorization"];
  const access_token = auth_header && auth_header.split(" ")[1];

  if (!access_token) {
    const error = new CustomError("No access token provided.", 401);
    return next(error);
  }

  jwt.verify(access_token, access_token_secret, (err, session) => {
    if (err) {
      const error = new CustomError(err.message, 403);
      return next(error);
    }
    req.session = session;
    if (!session.id) {
      const error = new CustomError("Invalid Access Token", 401);
      return next(error);
    }
    next();
  });
}

module.exports = auth;
