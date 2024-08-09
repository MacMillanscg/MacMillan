const mongoose = require("mongoose");
const shopifyDetailsSchema = require("./ShopifySchema");
const conversionActionSchema = require("./conversionSchema");
const PostFulfillmentSchema = require("./FullfillmentSchema");

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
  createdAt: { type: Date, default: Date.now },
});

const Connection = mongoose.model("Connection", ConnectionSchema);
module.exports = Connection;
