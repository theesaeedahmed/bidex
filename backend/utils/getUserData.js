const User = require("../models/User");
const CustomError = require("../utils/CustomError");

const getUserData = async (id, next) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      throw new CustomError("User not found.", 404);
    }

    if (!user.refreshToken) {
      throw new CustomError("User is not logged in.", 401);
    }

    return user;
  } catch (error) {
    return next(error);
  }
};

module.exports = getUserData;
