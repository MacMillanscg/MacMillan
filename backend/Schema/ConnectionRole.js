const mongoose = require("mongoose");
const ShopifyDetailsSchema = require("./ShopifySchema");

const connectionRule = new mongoose.Schema({
  connectionId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you're storing it as an ObjectId
    ref: "Connection",
    required: true,
  },
  connectionName: {
    type: String,
    required: true,
  },
  webhookTrigger: {
    description: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
  },
  shopifyDetails: ShopifyDetailsSchema,
});

// const ConnectionRole = mongoose.model("ConnectionRole", ConnectionSchema);
module.exports = connectionRule;
