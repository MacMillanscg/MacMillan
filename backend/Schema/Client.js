// models/Client.js
const mongoose = require("mongoose");

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
  storeUrl: {
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

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
