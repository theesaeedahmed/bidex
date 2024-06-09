const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const getUserData = require("../utils/getUserData");

const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET;

function generateAccessToken(user_id) {
  return jwt.sign({ id: user_id }, access_token_secret, {
    expiresIn: "10m",
  });
}

function generateRefreshToken(user_id) {
  return jwt.sign({ id: user_id }, refresh_token_secret, { expiresIn: "30d" });
}

/**
 * UNAUTHORIZED CONTROLLERS
 */

// /api/user/generate-token
const generateAccessTokenFromRefreshToken = asyncErrorHandler(
  async (req, res, next) => {
    const auth_header = req.headers["authorization"];
    const refresh_token = auth_header && auth_header.split(" ")[1];
    try {
      if (!refresh_token) {
        throw new CustomError("No refresh token provided.", 401);
      }

      const session = jwt.verify(refresh_token, refresh_token_secret);

      if (!session || !session.id) {
        throw new CustomError("Invalid refresh token", 401);
      }

      const user = await getUserData(session.id, next);

      const is_matching_refresh_token = await user.isValidRefreshToken(
        refresh_token
      );

      if (!is_matching_refresh_token) {
        throw new CustomError("Couldn't authenticate refresh token.", 403);
      }

      const access_token = generateAccessToken(user._id);

      res.status(200).json({ accessToken: access_token });
    } catch (error) {
      next(error);
    }
  }
);

// /api/user/register
const register = asyncErrorHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      throw new CustomError("All fields are required", 400);
    }

    const user = new User({ username, email, password });

    try {
      await user.save();
    } catch (error) {
      throw new CustomError(
        `Error saving (registering) user at DB: \n ${error.message}`,
        500
      );
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
});

// /api/user/login
const login = asyncErrorHandler(async (req, res, next) => {
  const { username, password, email } = req.body;
  try {
    if ((!username && !email) || !password) {
      throw new CustomError(
        "Required Fields: username (or email) and password",
        400
      );
    }

    const user = username
      ? await User.findOne({ username })
      : await User.findOne({ email });

    if (!user) {
      throw new CustomError("User not found: Incorrect username", 404);
    }

    const is_matching_password = await user.isValidPassword(password);
    if (!is_matching_password) {
      throw new CustomError("Incorrect password", 400);
    }

    const access_token = generateAccessToken(user._id);
    const refresh_token = generateRefreshToken(user._id);

    user.refreshToken = refresh_token;

    try {
      await user.save();
    } catch (error) {
      throw new CustomError(
        `Error saving refreshToken at DB: \n ${error.message}`,
        500
      );
    }

    res.status(200).json({
      accessToken: access_token,
      refreshToken: refresh_token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * AUTHORIZED CONTROLLERS
 */

// /auth/user/logout
const logout = asyncErrorHandler(async (req, res, next) => {
  try {
    const user = await getUserData(req.session.id, next);

    user.refreshToken = null;

    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
});

// /auth/user/update
const update = asyncErrorHandler(async (req, res, next) => {});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateAccessTokenFromRefreshToken,
  register,
  login,
  logout,
  update,
};
