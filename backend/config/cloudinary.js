const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const CustomError = require("../utils/CustomError");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (
  remote_folder_name,
  local_file_path,
  file_name
) => {
  try {
    if (!local_file_path) {
      throw new CustomError("Local file path not found");
    }
    if (!remote_folder_name) {
      remote_folder_name = "sample";
    }
    const response = await cloudinary.uploader.upload(local_file_path, {
      resource_type: "image",
      folder: remote_folder_name,
      public_id: file_name,
    });

    return response;
  } catch (error) {
    fs.unlinkSync(local_file_path);
    throw error;
  }
};

module.exports = { uploadOnCloudinary };
