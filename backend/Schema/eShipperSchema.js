const mongoose = require("mongoose");

const eShipperSchema = new mongoose.Schema({
  eShipperStoreUrl: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
    default: "",
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to automatically update the 'updatedAt' field
// eShipperSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

const EShipper = mongoose.model("EShipper", eShipperSchema);

module.exports = EShipper;
