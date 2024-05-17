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
  role: {
    type: String,
  },
  phone: {
    type: Number,
  },
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
