const mongoose = require("mongoose");

const WebhookTriggerSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  webhookUrl: { type: String },
  webhookSecret: { type: String },
});

const ManagementTriggerSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
});

const ConnectionSchema = new mongoose.Schema({
  connectionName: { type: String },
  description: { type: String },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  integrations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Integration",
      required: true,
    },
  ],
  webhookTrigger: WebhookTriggerSchema,
  managementTrigger: ManagementTriggerSchema,
  schedule: { type: String },
  cronExpression: { type: String },

  createdAt: { type: Date, default: Date.now },
});

const Connection = mongoose.model("Connection", ConnectionSchema);
module.exports = Connection;
