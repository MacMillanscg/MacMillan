const mongoose = require("mongoose");

const ConnectionSchema = new mongoose.Schema({
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

const ConnectionRole = mongoose.model("ConnectionRole", ConnectionSchema);
module.exports = ConnectionRole;
