const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET;

function auth(req, res, next) {
  const auth_header = req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1];

  try {
    if (!token) {
      throw new CustomError("No access token provided.", 401);
    }

    let secret = access_token_secret;

    if (req.originalUrl.endsWith("/generate-token")) {
      secret = refresh_token_secret;
    }

    const session = jwt.verify(token, secret);

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
