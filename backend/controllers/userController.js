const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { validateUserSession } = require("../utils/functions");
const Wallet = require("../models/Wallet");

const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET;

function generateAccessToken(user_id) {
  return jwt.sign({ id: user_id }, access_token_secret, {
    expiresIn: "30m",
  });
}

function generateRefreshToken(user_id) {
  return jwt.sign({ id: user_id }, refresh_token_secret, { expiresIn: "30d" });
}

/**
 * UNAUTHORIZED CONTROLLERS
 */

// /api/user/register
const register = asyncErrorHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      throw new CustomError("All fields are required", 400);
    }

    const user = new User({ username, email, password });
    const wallet = new Wallet({ userId: user._id });

    user.walletId = wallet._id;

    try {
      await user.save();
      await wallet.save();
    } catch (error) {
      throw new CustomError(
        `Error saving (registering) user at DB: \n ${error.message}`,
        500
      );
    }

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    next(error);
  }
});

// /api/user/login
const login = asyncErrorHandler(async (req, res, next) => {
  const { username, password, email } = req.body;
  const verify_admin = req.headers["verify-admin"] === "true";

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

    if (user.accessTokens.length >= 1) {
      throw new CustomError(
        "Maximum login limit reached. Logout of other devices in order to login here.",
        400
      );
    }

    if (verify_admin && !user.isAdmin) {
      throw new CustomError("Not an Admin. Access Denied.", 403);
    }

    const is_matching_password = await user.isValidPassword(password);
    if (!is_matching_password) {
      throw new CustomError("Incorrect password", 400);
    }

    const access_token = generateAccessToken(user._id);
    const refresh_token = generateRefreshToken(user._id);

    user.refreshToken = refresh_token;
    user.accessTokens.push(access_token);

    try {
      await user.save();
    } catch (error) {
      throw new CustomError(
        `Error saving refreshToken and accessToken at DB: \n ${error.message}`,
        500
      );
    }

    const user_profile = { username: user.username, email: user.email };

    res.status(200).json({
      accessToken: access_token,
      refreshToken: refresh_token,
      user: user_profile,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * AUTHORIZED CONTROLLERS
 */

// /auth/user/generate-token
const generateAccessTokenFromRefreshToken = asyncErrorHandler(
  async (req, res, next) => {
    try {
      const refresh_token = req.headers["authorization"].split(" ")[1];
      const user = await validateUserSession(
        req.session.id,
        refresh_token,
        true
      );

      if (user.refreshToken !== refresh_token) {
        throw new CustomError("Refresh tokens do not match.", 403);
      }

      const refreshed_access_token = generateAccessToken(user._id);

      user.accessTokens[0] = refreshed_access_token;

      await user.save();

      res.status(200).json({ accessToken: refreshed_access_token });
    } catch (error) {
      next(error);
    }
  }
);

// /auth/user/logout
const logout = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const user = await validateUserSession(req.session.id, access_token);

    user.refreshToken = null;
    const access_token_idx = user.accessTokens.findIndex(
      (token) => token === access_token
    );
    user.accessTokens.splice(access_token_idx, 1);

    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
});

// auth/user/profile
const userProfile = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const user = await validateUserSession(req.session.id, access_token);

    res
      .status(200)
      .json({ user: { username: user.username, email: user.email } });
  } catch (error) {
    next(error);
  }
});

// /auth/user/profile/update
const update = asyncErrorHandler(async (req, res, next) => {
  try {
    const access_token = req.headers["authorization"].split(" ")[1];
    const user = await validateUserSession(req.session.id, access_token);
    const { username, email, password } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    const new_refresh_token = generateRefreshToken(user._id);
    const new_access_token = generateAccessToken(user._id);

    user.refreshToken = new_refresh_token;
    user.accessTokens = [new_access_token];

    const updated_user = await user.save();

    const user_profile = { username: user.username, email: user.email };

    res.status(200).json({
      accessToken: new_access_token,
      refreshToken: new_refresh_token,
      user: user_profile,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  generateAccessTokenFromRefreshToken,
  register,
  login,
  logout,
  update,
  userProfile,
};
