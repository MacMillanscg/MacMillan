const mongoose = require("mongoose");

const supportShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const supportModel = mongoose.model("support", supportShema);
module.exports = supportModel;
