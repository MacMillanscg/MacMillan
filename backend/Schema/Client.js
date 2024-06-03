// models/Client.js
const mongoose = require("mongoose");

const IntegrationSchema = new mongoose.Schema({
  integrationName: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  storeUrl: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
  },
  consumerKey: {
    type: String,
  },
  consumerSecret: {
    type: String,
  },
  accessToken: {
    type: String,
  },
  accessTokenSecret: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ClientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  integrations: [IntegrationSchema], // Array of integration objects
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
