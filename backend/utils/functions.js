const User = require("../models/User");
const CustomError = require("../utils/CustomError");

const validateUserSession = async (
  id,
  token,
  isRefreshToken = false,
  checkIsUserAdmin = false
) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      throw new CustomError("User not found.", 404);
    }

    // make sure access token and refresh token are present, if not, remove them and logout user
    if (!user.refreshToken) {
      if (user.accessTokens.length) {
        user.accessTokens = [];
        await user.save();
      }
      throw new CustomError("User is not logged in.", 401);
    } else if (!user.accessTokens.length) {
      user.refreshToken = null;
      await user.save();
      throw new CustomError("User is not logged in.", 401);
    }

    if (!token) {
      throw new Error("Need to pass token to validate user session.");
    }

    // verify the access token / refesh token from the ones in db
    if (isRefreshToken) {
      const is_matching_refresh_token = await user.hasMatchingRefreshToken(
        token
      );

      if (!is_matching_refresh_token) {
        throw new CustomError("Couldn't authenticate refresh token.", 403);
      }
    } else {
      const is_matching_access_token = user.hasMatchingAccessToken(token);

      if (!is_matching_access_token) {
        throw new CustomError("Couldn't authenticate access token.", 403);
      }
    }

    if (checkIsUserAdmin && !user.isAdmin) {
      throw new CustomError("User is not an Admin.", 403);
    }

    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = { validateUserSession };
