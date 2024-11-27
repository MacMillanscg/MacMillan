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
  verified: {
    type: Boolean,
    default: false, // Default verification status for new users
  },
  verificationToken: {
    type: String,
  },
  role: {
    type: String,
  },
  phone: {
    type: Number,
  },
  profileImage: {
    type: String, // Assuming you will store the file path of the uploaded image
  },
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
