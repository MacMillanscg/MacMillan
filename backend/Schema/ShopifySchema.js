// models/ShopifyDetailsSchema.js
const mongoose = require("mongoose");

// Define ShopifyDetailsSchema
const ShopifyDetailsSchema = new mongoose.Schema({
  shopifyTitle: { type: String },
  shopifyDetails: { type: String },
});

module.exports = ShopifyDetailsSchema;
