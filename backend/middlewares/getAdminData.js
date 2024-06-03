const User = require("../models/User");
const CustomError = require("../utils/CustomError");

const getAdminData = async (req, res, next) => {
  const admin_id = req.session.id;
  try {
    const admin = await User.findById(admin_id);
    if (!admin) {
      throw new CustomError("User not found.", 400);
    }
    if (!admin.isAdmin) {
      throw new CustomError("User is not an Admin.", 403);
    }
    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = getAdminData;
