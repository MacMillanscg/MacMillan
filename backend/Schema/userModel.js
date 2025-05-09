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
    enum: ["admin", "member", "guest"],
    default: "member",
  },
  phone: {
    type: Number,
  },
  profileImage: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
