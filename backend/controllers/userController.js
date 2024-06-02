const jwt = require("jsonwebtoken");
const User = require("../models/User");
const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET;

function generateAccessToken(user_id) {
  return jwt.sign({ id: user_id }, access_token_secret, {
    expiresIn: "10m",
  });
}

function generateRefreshToken(user_id) {
  return jwt.sign({ id: user_id }, refresh_token_secret, { expiresIn: "180d" });
}

const generateAccessTokenFromRefreshToken = async (req, res) => {
  const auth_header = req.headers["authorization"];
  const refresh_token = auth_header && auth_header.split(" ")[1];

  if (!refresh_token) {
    return res
      .status(401)
      .json({ message: "Access denied. No refreshToken provided." });
  }

  jwt.verify(refresh_token, refresh_token_secret, async (err, session) => {
    if (err) {
      return res.status(403).json({ message: err.message });
    }

    try {
      const user_id = session.id;
      const user = await User.findById(user_id);

      if (!user || user.refreshToken !== refresh_token) {
        if (!user.refreshToken) {
          return res.status(401).json({ message: "User is logged out." });
        }
        return res.status(400).json({ message: "Invalid refresh token" });
      }

      const access_token = generateAccessToken(user_id);

      res.status(200).json({ accessToken: access_token });
    } catch (ex) {
      res.status(400).json({ message: "Invalid refreshToken" });
    }
  });
};

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const is_match = await user.isValidPassword(password);

    if (!is_match) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const access_token = generateAccessToken(user._id);
    const refresh_token = generateRefreshToken(user._id);

    user.refreshToken = refresh_token;
    await user.save();

    res.json({
      accessToken: access_token,
      refreshToken: refresh_token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  const user_id = req.session.id;
  const user = await User.findById(user_id);

  try {
    if (user.refreshToken) {
      user.refreshToken = null;
      await user.save();
    }
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateAccessTokenFromRefreshToken,
  register,
  login,
  logout,
};
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWI1MWYxYzMyZGVmNGQ1ODA5ODE1ZCIsImlhdCI6MTcxNzMxNTIwNiwiZXhwIjoxNzE3MzE1MjY2fQ.IXWM73pXnGUQ4jTnLrxCjYrNBOSOvmaP47ygPjRuRZ4

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWI1MWYxYzMyZGVmNGQ1ODA5ODE1ZCIsImlhdCI6MTcxNzMxNTIwNiwiZXhwIjoxNzE3MzE1NTY2fQ.3L1YYvVTZppH4u9W8uD4Y6axrLbhBGUjuxQsgUfxw2I
