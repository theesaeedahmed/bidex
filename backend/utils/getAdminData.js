const User = require("../models/User");
const CustomError = require("./CustomError");

const getAdminData = async (id, next) => {
  try {
    const admin = await User.findById(id);
    if (!admin) {
      throw new CustomError("User not found.", 400);
    }

    if (!admin.refreshToken) {
      throw new CustomError("User is not logged in.", 401);
    }

    if (!admin.isAdmin) {
      throw new CustomError("User is not an Admin.", 403);
    }

    return admin;
  } catch (error) {
    next(error);
  }
};

module.exports = getAdminData;
