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
  // console.log("body", req.body);

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
      `https://d7bc5d-1a.myshopify.com/admin/api/2024-04/fulfillments/4927362138326/update_tracking.json`,
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

exports.getUnFullFillment = async (req, res) => {
  const { id } = req.params; // Get the connection ID from the request params
  console.log("Received connection ID:", id);

  try {
    // Find the connection from your MongoDB database
    const connection = await Connection.findById(id);
    // console.log("Connection details:", connection);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    // Extract the API key and store URL from the integration data
    const integration = connection.integrations[0];
    console.log("Integration details:", integration);
    const { apiKey, storeUrl } = integration;

    // First API call to get the list of orders
    const responseId = await axios.get(
      `https://${storeUrl}/admin/api/2024-04/orders.json`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": apiKey,
        },
      }
    );

    // Extract the order IDs from the response
    const orders = responseId.data.orders;
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    // Get all order IDs
    const orderIds = orders.map((order) => order.id);
    // console.log("Order IDs:", orderIds);

    // ArrulfillmentResultsay to store the results of all fulfillment orders
    const fulfillmentOrderIds = [];

    // Loop through each order ID and get the fulfillment orders
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

        // Store only the ids in the result array
        fulfillmentOrderIds.push(...ids);
        // console.log(`Fulfillment order IDs for order ${orderId}:`, ids);
      } catch (error) {
        console.error(
          `Error fetching fulfillment for order ${orderId}:`,
          error
        );
      }
    }

    // Respond with all the collected fulfillment data
    res.status(200).json({ fulfillmentOrderIds });
  } catch (error) {
    console.error("Error fetching fulfillment details:", error);
    res.status(500).json({ error: "Failed to fetch fulfillment details" });
  }
};

exports.createShopifyOrdersId = async (req, res) => {
  try {
    const { orderIds } = req.body;
    // console.log(req.body);

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
    // console.log(shopifyOrderIds);

    // Return the shopifyOrderIds
    res.status(200).json(shopifyOrderIds);
  } catch (error) {
    console.error("Error retrieving order IDs:", error);
    res.status(500).json({ message: "Error retrieving order IDs", error });
  }
};

// To make the unfilfullment orders to filfullment orders
exports.createFulfillment = async (req, res) => {
  const { id } = req.params;
  console.log("abccc", id);
  const { fulfillment_order_id, message, tracking_info } = req.body;
  console.log("req obdy=", req.body);

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

    // Make a POST request to the Shopify fulfillment API
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

    // Respond with the data from Shopify's API
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error creating fulfillment:", error);
    res.status(500).json({ error: "Failed to create fulfillment" });
  }
};
