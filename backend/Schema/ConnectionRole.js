const mongoose = require("mongoose");

const ConnectionRole = new mongoose.Schema({
  connectionId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you're storing it as an ObjectId
    required: true,
  },
  connectionName: {
    type: String,
    required: true,
    ref: "Connection",
  },
  webhookTrigger: {
    description: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
  },
  managementTrigger: {
    type: String,
    default: null,
  },
  schedule: {
    type: String,
    default: null,
  },
  cronExpression: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("ConnectionRole", ConnectionRole);
