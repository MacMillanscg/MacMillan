const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String },  
  platform: { type: String, default: "Shopify" }, 
  createdDate: { type: Date, default: Date.now },
  address: {type: String},
  customer: {type: String},

});

const OrdersRecords = mongoose.model("OrderRecord", orderSchema);

module.exports = OrdersRecords;