const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Order schema
const OrderSchema = new Schema({
  shopifyId: {
    type: String,
  },
  platform: { type: String, default: "Shopify" }, 
  createdDate: { type: Date },
  address: {type: String,},
  customer: {type: String,},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clientName: {type: String},
});

// Create the Order model
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
