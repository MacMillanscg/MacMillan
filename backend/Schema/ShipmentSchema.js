const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  shipmentId: { type: String },
  shopifyOrderId: { type: String},
  scheduledShipDate: { type: String },
  from: {
    attention: { type: String },
    company: { type: String },
    address1: { type: String },
  },
  to :{
    attention: { type: String },
    company: { type: String },
    address1: { type: String },
  },

  packagingUnit: { type: String },
  packages: {
    type: { type: String },
    packages: [
      {
        height: { type: String },
        length: { type: String },
        width: { type: String },
        dimensionUnit: { type: String },
        weight: { type: String },
        weightUnit: { type: String },
        insuranceAmount: { type: String },
        description: { type: String },
      },
    ],
  },
  reference1: { type: String },
  reference2: { type: String },
  reference3: { type: String },
  // signatureRequired: { type: String },
  // insuranceType: { type: String },
  pickup: {
    contactName: { type: String },
    phoneNumber: { type: String },
    pickupDate: { type: String },
    pickupTime: { type: String },
    closingTime: { type: String },
    // location: { type: String },
    // instructions: { type: String },
  },
  trackingNumber: { type: String },
  trackingUrl: { type: String }, 
  labelData: { type: Buffer } 
});
const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;
