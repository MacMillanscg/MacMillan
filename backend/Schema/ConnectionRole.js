const mongoose = require("mongoose");

const ConnectionRule = new mongoose.Schema({
  connectionId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you're storing it as an ObjectId
    ref: "Connection",
    required: true,
  },
  connectionName: {
    type: String,
    required: true,
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
});

// const ConnectionRole = mongoose.model("ConnectionRole", ConnectionSchema);
module.exports = ConnectionRule;
