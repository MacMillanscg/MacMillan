const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  shipmentId: {type:String},
  shopifyOrderId: {type:String},
  carrier: { type: String }, 
  trackingNumber: { type: String }, 
  trackingUrl: { type: String }, 
  status: { type: String }, 
  references: {
    reference1: { type: String },
    reference2: { type: String },
    reference3: { type: String },
  },
  dimensions: { type: String }, 
  weight: { type: String },
  labels: { type: String },
  createdDate: { type: Date },
  shippedDate: { type: Date },
  client: { type: String },
  customer: { type: String },
  address: { type: String },
  platform: { type: String },
  createdAt: { type: Date, default: Date.now },
  // Add more fields as required, e.g., status, package details, etc.
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;
