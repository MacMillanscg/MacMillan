const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  isVerified: { type: Boolean, default: false }, // Added for email verification
  verificationToken: String, // Added for email verification
  resetToken: String, // Added for password reset
  resetTokenExpiry: Date, // Added for password reset
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
