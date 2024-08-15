const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Order schema
const OrderSchema = new Schema({
  shopifyId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Order model
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
