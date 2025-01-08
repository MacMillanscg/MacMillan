const Connection = require("../Schema/Connection");
const Transaction = require("../Schema/Transaction");
const Order = require("../Schema/ShopifyOrderSchema");
const User = require("../Schema/userModel");
const NewMember = require("../Schema/newMemberSchema");
const Webhook = require("../Schema/Webhook");
const Client = require("../Schema/Client");
const axios = require("axios");
const mongoose = require("mongoose");
const logger = require("../logger");

// Shopify and XML Conversion Related Controllers

// Create Shopify Connection
exports.createShopifyConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { shopifyTitle, shopifyDetails, newRules, selectedStepId } = req.body;

    const updatedConnection = await Connection.findByIdAndUpdate(
      id,
      { shopifyDetails: { shopifyTitle, shopifyDetails } },
      { new: true, runValidators: true }
    );

    if (!updatedConnection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    const updatedNewRulesIdConnection = await Connection.findByIdAndUpdate(
      id,
      { $addToSet: { newRulesId: selectedStepId } },
      { new: true, runValidators: true }
    );

    if (!updatedNewRulesIdConnection) {
      return res.status(404).json({ error: "Unable to update newRulesId" });
    }

    res.status(200).json({
      message: "Shopify connection updated successfully",
      shopify: updatedNewRulesIdConnection,
      newRulesId: updatedNewRulesIdConnection.newRulesId,
    });
  } catch (error) {
    console.error("Error updating Shopify connection:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add XML Conversion
exports.addXmlConvertion = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, action } = req.body;

    const updatedXMlconversion = await Connection.findByIdAndUpdate(
      id,
      { conversionsXML: { name, description, action } },
      { new: true, runValidators: true }
    );

    if (!updatedXMlconversion) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json({
      message: "XMLConvertion created successfully",
      xmlConvertion: updatedXMlconversion,
    });
  } catch (error) {
    console.error("Error in conversion of XML file:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Shopify Details
exports.getShopifyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await Connection.findById(id).select("shopifyDetails");

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json(connection.shopifyDetails);
  } catch (error) {
    console.error("Error fetching Shopify details:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get XML Conversion Details
exports.getXMLConversion = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await Connection.findById(id).select("conversionsXML");

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json(connection);
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add All Orders
exports.addAllOrders = async (req, res) => {
  const { clientId, integrationId, type } = req.body;

  try {
    const transaction = new Transaction({
      clientId,
      integrationId,
      type,
    });

    const transactionData = await transaction.save();
    res.status(201).json({
      message: "Transaction saved successfully",
      transaction: transactionData,
    });
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({ error: "Failed to save transaction" });
  }
};

// Delete Shopify Details
exports.deleteShopifyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedConnection = await Connection.findByIdAndUpdate(
      id,
      { $unset: { shopifyDetails: "" } },
      { new: true, runValidators: true }
    );

    if (!updatedConnection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json({
      message: "Shopify details deleted successfully",
      updatedConnectionShopify: updatedConnection,
    });
  } catch (error) {
    console.error("Error deleting Shopify details:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update Shopify Fulfillment
exports.updateShopifyFullfillment = async (req, res) => {
  const { id, fulfillmentId, trackingNumber, trackingCompany, postFullfillments } = req.body;

  try {
    const connection = await Connection.findById(id);
    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    const newFulfillment = {
      fulfillmentId,
      trackingNumber,
      trackingCompany,
      postFullfillments,
    };

    connection.postFulfillments.push(newFulfillment);
    const data = await connection.save();

    res.status(200).json({ connection: data });
  } catch (error) {
    console.error("Error updating fulfillment data:", error);
    res.status(500).json({ error: "Failed to update fulfillment data" });
  }
};

// Get Unfulfilled Orders
exports.getUnFullFillment = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    const integration = connection.integrations[0];
    const { apiKey, storeUrl } = integration;

    const responseId = await axios.get(
      `https://${storeUrl}/admin/api/2024-04/orders.json`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": apiKey,
        },
      }
    );

    const orders = responseId.data.orders;

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    const orderIds = orders.map((order) => order.id);

    const fulfillmentOrderIds = [];

    for (const orderId of orderIds) {
      try {
        const response = await axios.get(
          `https://${storeUrl}/admin/api/2024-07/orders/${orderId}/fulfillment_orders.json`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": apiKey,
            },
          }
        );

        const fulfillmentOrders = response.data.fulfillment_orders;
        const ids = fulfillmentOrders.map((order) => order.id);

        fulfillmentOrderIds.push(...ids);
      } catch (error) {
        console.error(`Error fetching fulfillment for order ${orderId}:`, error);
      }
    }

    res.status(200).json({ fulfillmentOrderIds });
  } catch (error) {
    console.error("Error fetching fulfillment details:", error);
    res.status(500).json({ error: "Failed to fetch fulfillment details" });
  }
};

// Create Shopify Order IDs
exports.createShopifyOrdersId = async (req, res) => {
  try {
    const { orderIds } = req.body;

    const bulkOperations = orderIds.map((id) => ({
      updateOne: {
        filter: { shopifyId: id },
        update: { shopifyId: id },
        upsert: true,
      },
    }));

    await Order.bulkWrite(bulkOperations);

    res.status(200).json({ message: "Order IDs saved successfully" });
  } catch (error) {
    console.error("Error saving order IDs:", error);
    res.status(500).json({ message: "Error saving order IDs", error });
  }
};

// Get All Shopify Order IDs
exports.getAllShopifyOrdersIds = async (req, res) => {
  try {
    const shopifyOrderIds = await Order.find({}, { shopifyId: 1, _id: 0 });

    res.status(200).json(shopifyOrderIds);
  } catch (error) {
    console.error("Error retrieving order IDs:", error);
    res.status(500).json({ message: "Error retrieving order IDs", error });
  }
};

// Create Fulfillment
exports.createFulfillment = async (req, res) => {
  const { id } = req.params;
  const { fulfillment_order_id, message, tracking_info } = req.body;

  try {
    const connection = await Connection.findById(id);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    const integration = connection.integrations[0];
    const { apiKey, storeUrl } = integration;

    const requestBody = {
      fulfillment: {
        message: message || "The package was shipped this morning.",
        notify_customer: false,
        tracking_info: tracking_info || {
          number: "1Z001985YW99744123411341",
          url: "https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=1Z001985YW99744123411341",
        },
        line_items_by_fulfillment_order: [
          {
            fulfillment_order_id: fulfillment_order_id,
          },
        ],
      },
    };

    const response = await axios.post(
      `https://${storeUrl}/admin/api/2024-04/fulfillments.json`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": apiKey,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error creating fulfillment:", error);
    res.status(500).json({ error: "Failed to create fulfillment" });
  }
};

// Delete XML Conversion
exports.deleteXmlConversion = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedConnection = await Connection.findByIdAndUpdate(
      id,
      { $unset: { conversionsXML: "" } },
      { new: true, runValidators: true }
    );

    if (!updatedConnection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json({
      message: "XML Conversion deleted successfully",
      updatedConnectionXmlConversion: updatedConnection,
    });
  } catch (error) {
    console.error("Error deleting XML Conversion:", error);
    res.status(500).json({ error: error.message });
  }
};
