// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accessTokens: [
      {
        type: String,
        default: null,
      },
    ],
    refreshToken: {
      type: String,
      default: null,
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet", // Reference to Wallet schema
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password and refreshToken (if refreshToken is not null)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") && !this.isModified("refreshToken")) {
    return next();
  }

  try {
    if (this.isModified("password") && this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.isModified("refreshToken") && this.refreshToken) {
      const salt = await bcrypt.genSalt(10);
      this.refreshToken = await bcrypt.hash(this.refreshToken, salt);
    }

    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.hasMatchingRefreshToken = async function (refreshToken) {
  if (this.refreshToken) {
    return await bcrypt.compare(refreshToken, this.refreshToken);
  } else {
    return false;
  }
};

UserSchema.methods.hasMatchingAccessToken = function (accessToken) {
  const index = this.accessTokens.findIndex((token) => token === accessToken);

  if (index === -1) {
    return false;
  }
  return true;
};

module.exports = mongoose.model("User", UserSchema);
