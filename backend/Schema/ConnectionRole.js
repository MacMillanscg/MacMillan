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
  managementTrigger: {
    description: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
  },
  scheduleDetails: {
    schedule: {
      type: String,
      default: null, // Store the type of schedule
    },
    cronExpression: {
      type: String,
      default: null, // To store the cron expression
    },
    option: {
      type: String,
    },
  },
  shopifyDetails: ShopifyDetailsSchema,
});

module.exports = connectionRule;
