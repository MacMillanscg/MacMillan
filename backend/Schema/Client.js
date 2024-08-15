// models/Client.js
const mongoose = require("mongoose");

const IntegrationSchema = new mongoose.Schema({
  integrationName: {
    type: String,
    // required: true,
  },
  platform: {
    type: String,
    // required: true,
  },
  storeUrl: {
    type: String,
    // required: true,
  },
  apiKey: {
    type: String,
  },
  eShipperStoreUrl: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
    default: "",
    trim: true,
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
  isActive: {
    type: Boolean,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    // required: true,
  },
  integrations: [IntegrationSchema], // Array of integration objects
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
