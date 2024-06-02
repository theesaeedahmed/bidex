const jwt = require("jsonwebtoken");
const access_token_secret = process.env.ACCESS_TOKEN_SECRET;

function auth(req, res, next) {
  const auth_header = req.headers["authorization"];
  const access_token = auth_header && auth_header.split(" ")[1];

  if (!access_token)
    return res
      .status(401)
      .json({ message: "Access denied. No accessToken provided." });

  jwt.verify(access_token, access_token_secret, (err, session) => {
    if (err) {
      return res.status(403).json({ message: err.message });
    }
    try {
      req.session = session;
      next();
    } catch (ex) {
      res.status(400).json({ message: "Invalid access_token." });
    }
  });
}

module.exports = auth;
