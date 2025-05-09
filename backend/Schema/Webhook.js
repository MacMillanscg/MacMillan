const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WebhookSchema = new Schema({
  name: {
    type: String,
    // required: true,
  },
  url: {
    type: String,
    // required: true,
  },
  apiKey: {
    type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Webhook", WebhookSchema);
