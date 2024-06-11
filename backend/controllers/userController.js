const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { validateUserSession } = require("../utils/functions");

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

    if (user.accessTokens.length >= 2) {
      throw new CustomError(
        "Maximum login limit reached. Logout of other devices in order to login here.",
        400
      );
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

      const access_token = req.headers["x-access-token"];

      if (!access_token) {
        throw new CustomError(
          "Need to pass x-access-token header to refresh access token"
        );
      }

      if (!user.hasMatchingAccessToken(access_token)) {
        throw new CustomError("Access Token not present in DB.", 403);
      }
      // const is_matching_refresh_token = await user.hasMatchingRefreshToken(
      //   refresh_token
      // );

      // if (!is_matching_refresh_token) {
      //   throw new CustomError("Couldn't authenticate refresh token.", 403);
      // }

      const refreshed_access_token = generateAccessToken(user._id);

      const access_token_idx = user.accessTokens.findIndex(
        (token) => token === access_token
      );
      user.accessTokens.splice(access_token_idx, 1);

      user.accessTokens.push(refreshed_access_token);

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

    const { password, refreshToken, accessTokens, __v, ...safe_user } =
      user._doc;

    res.status(200).json({ user: safe_user });
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

    if (password) {
      const refresh_token = generateRefreshToken(user._id);
      const access_token = generateAccessToken(user._id);

      user.refreshToken = refresh_token;
      user.accessTokens = [access_token];
    }

    const updated_user = await user.save();

    const {
      password: user_password,
      refreshToken: refresh_token,
      accessTokens: access_tokens,
      __v,
      ...safe_user
    } = updated_user._doc;

    if (password) {
      safe_user.refreshToken = refresh_token;
      safe_user.accessToken = access_tokens[0];
    }

    res.status(200).json({ user: safe_user });
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
