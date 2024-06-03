const User = require("../models/User");
const CustomError = require("../utils/CustomError");

const getUserData = async (req, res, next) => {
  const user_id = req.session.id;
  try {
    const user = await User.findById(user_id);
    if (!user) {
      throw new CustomError("User not found.", 400);
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = getUserData;
