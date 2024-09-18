const Connection = require("../Schema/Connection");
const Transaction = require("../Schema/Transaction");
const Order = require("../Schema/ShopifyOrderSchema");
const axios = require("axios");
const { shofipyOrders } = require("./connectionController");

// create shopify connection
exports.createShopifyConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { shopifyTitle, shopifyDetails } = req.body;

    const updatedConnection = await Connection.findByIdAndUpdate(
      id,
      { shopifyDetails: { shopifyTitle, shopifyDetails } },
      { new: true, runValidators: true }
    );

    if (!updatedConnection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json({
      message: "Shopify created successfully",
      shopify: updatedConnection,
    });
  } catch (error) {
    console.error("Error updating Shopify details:", error);
    res.status(500).json({ error: error.message });
  }
};

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
    // console.log("req,bldy", req.body);
  } catch (error) {
    console.error("Error in conversion of xml file");
    res.status(500).json({ error: error.message });
  }
};
// get shopify connection
exports.getShopifyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await Connection.findById(id).select("shopifyDetails");
    // console.log("connection shopify", connection);

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json(connection.shopifyDetails);
  } catch (error) {
    console.error("Error fetching Shopify details:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getXMLConversion = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await Connection.findById(id).select("conversionsXML");
    // console.log("Conversion Data:", connection);
    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }
    res.status(200).json(connection);
  } catch (error) {
    console.error("Error in fetching details:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.addAllOrders = async (req, res) => {
  const { clientId, integrationId, type, shopifyId } = req.body;
  // console.log("ordersss", req.body);

  try {
    const transaction = new Transaction({
      clientId,
      integrationId,
      type,
      // shopifyId,
    });

    const transactionData = await transaction.save();
    res.status(201).json({
      message: "Transaction saved successfully",
      transaction: transactionData,
    });
    // console.log("trans", transactionData);
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({ error: "Failed to save transaction" });
  }
};
// 5426
exports.deleteShopifyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedConnection = await Connection.findByIdAndUpdate(
      id,
      { $unset: { shopifyDetails: "" } }, // Unset the shopifyDetails field
      { new: true, runValidators: true }
    );

    if (!updatedConnection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json({
      message: "shopify deleted successfully",
      updatedConnectionShopify: updatedConnection,
    });
  } catch (error) {
    console.error("Error deleting Shopify details:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateShopifyFullfillment = async (req, res) => {
  const {
    id,
    fulfillmentId,
    trackingNumber,
    trackingCompany,
    postFullfillments,
  } = req.body;
  console.log("body", req.body);

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

    const fulfillmentUpdateData = {
      fulfillment: {
        tracking_info: {
          company: trackingCompany,
          number: trackingNumber,
        },
      },
    };

    const response = await axios.post(
      `https://27cd06-29.myshopify.com/admin/api/2024-04/fulfillments/4927362138326/update_tracking.json`,
      fulfillmentUpdateData,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": "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",
        },
      }
    );

    res
      .status(200)
      .json({ shopifyResponse: response.data, connection: connection });
  } catch (error) {
    console.error("Error updating fulfillment data:", error);
    res.status(500).json({ error: "Failed to update fulfillment data" });
  }
};

// get shopify fullfillment

exports.getFullFillment = async (req, res) => {
  const { orderId } = req.params;

  try {
    const storeUrl = "27cd06-29.myshopify.com"; // Replace with your Shopify store URL
    const accessToken = "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"; // Replace with your Shopify Admin API access token

    const response = await axios.get(
      `https://${storeUrl}/admin/api/2024-04/orders/${orderId}/fulfillments.json`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching fulfillment details:", error);
    res.status(500).json({ error: "Failed to fetch fulfillment details" });
  }
};

exports.createShopifyOrdersId = async (req, res) => {
  try {
    const { orderIds } = req.body;
    console.log(req.body);

    const bulkOperations = orderIds.map((id) => ({
      updateOne: {
        filter: { shopifyId: id },
        update: { shopifyId: id },
        upsert: true, // Insert if not exists, otherwise update
      },
    }));

    await Order.bulkWrite(bulkOperations);

    res.status(200).json({ message: "Order IDs saved successfully" });
  } catch (error) {
    console.error("Error saving order IDs:", error);
    res.status(500).json({ message: "Error saving order IDs", error });
  }
};

exports.getAllShopifyOrdersIds = async (req, res) => {
  try {
    // Retrieve all the documents and select only the 'shopifyId' field
    const shopifyOrderIds = await Order.find({}, { shopifyId: 1, _id: 0 });
    console.log(shopifyOrderIds);

    // Return the shopifyOrderIds
    res.status(200).json(shopifyOrderIds);
  } catch (error) {
    console.error("Error retrieving order IDs:", error);
    res.status(500).json({ message: "Error retrieving order IDs", error });
  }
};
