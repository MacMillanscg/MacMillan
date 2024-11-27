const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  shipmentId: String,
  shopifyOrderId: String,
  createdAt: { type: Date, default: Date.now },
  // Add more fields as required, e.g., status, package details, etc.
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;
