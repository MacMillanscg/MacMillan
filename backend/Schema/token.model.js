const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const tokenModel = mongoose.model("tokens", tokenSchema);
module.exports = tokenModel;
