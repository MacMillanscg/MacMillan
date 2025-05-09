// models/Log.js
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  message: {
    type: String,
    // required: true,
  },
  title: {
    type: String,
  },
  type: {
    type: String,
    enum: ["success", "error", "warning"],
    // required: true,
  },
  userId: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Log", logSchema);
