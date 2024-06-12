const mongoose = require("mongoose");

const WebhookTriggerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  webhookUrl: { type: String },
  webhookSecret: { type: String },
});

const ManagementTriggerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const ConnectionSchema = new mongoose.Schema({
  connectionName: { type: String, required: true },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  integrations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Integration" }],
  webhookTrigger: WebhookTriggerSchema,
  managementTrigger: ManagementTriggerSchema,
  schedule: { type: String },
  cronExpression: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Connection", ConnectionSchema);
