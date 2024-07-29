const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    // required: true,
  },
  integrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Integration",
    // required: true,
  },
  type: { type: String }, // E.g., 'order', 'fulfillment', 'GET', 'POST'
  shopifyId: [{ type: Number }],
  timestamp: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
