const mongoose = require("mongoose");
const shopifyDetailsSchema = require("./ShopifySchema");
const conversionActionSchema = require("./conversionSchema");
const PostFulfillmentSchema = require("./FullfillmentSchema");
const connectionRule = require("./ConnectionRole");

const VersionSchema = new mongoose.Schema({
  versionNumber: { type: Number }, // Auto-incremented version number
  createdAt: { type: Date, default: Date.now }, // Timestamp for the version
});

const IntegrationSchema = new mongoose.Schema({
  integrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Integration",
  },
  integrationName: {
    type: String,
  },
  platform: {
    type: String,
  },
  storeUrl: {
    type: String,
  },
  apiKey: {
    type: String,
  },
});

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
  userId: {
    type: String,
  },
  connectionName: { type: String },
  description: { type: String },
  hideUnavailable: { type: Boolean, default: false },
  client: {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    clientName: {
      type: String,
    },
  },
  integrations: [IntegrationSchema],

  webhookTrigger: WebhookTriggerSchema,
  managementTrigger: ManagementTriggerSchema,
  schedule: { type: String },
  cronExpression: { type: String },
  shopifyDetails: shopifyDetailsSchema,
  conversionsXML: conversionActionSchema,
  postFulfillments: [PostFulfillmentSchema],
  connectionRule: [connectionRule], //  To create connection rules
  newRulesId: [String],
  newRulesSchedule: [String],
  createdAt: { type: Date, default: Date.now },
  versions: [VersionSchema], // Store version history
});

const Connection = mongoose.model("Connection", ConnectionSchema);
module.exports = Connection;
