const mongoose = require("mongoose");

const PostFulfillmentSchema = new mongoose.Schema({
  fulfillmentId: {
    type: String,
    // required: true,
  },
  trackingNumber: {
    type: String,
    // required: true,
  },
  trackingCompany: {
    type: String,
    // required: true,
  },
  postFulfillments: {
    type: [String],
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = PostFulfillmentSchema;
