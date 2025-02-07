const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  clientId: {
    type: String,
  },
  integrationId: [
    {
      type: String,
    },
  ],
  type: { type: String },
  // shopifyId: [{ type: Number }],
  timestamp: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
