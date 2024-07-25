const Connection = require("../Schema/Connection");
const ShopifyDetails = require("../Schema/ShopifySchema");
const axios = require("axios");
const Webhook = require("../Schema/Webhook");

exports.getAllConnections = async (req, res) => {
  try {
    const connections = await Connection.find();
    res.status(200).json(connections);
  } catch (error) {
    console.log("Error in finding the connections");
    res.status(500).json({ error: error.message });
  }
};

exports.createWebhook = async (req, res) => {
  const { name, url, apiKey } = req.body;
  console.log("reqbody", req.body);

  if (!name || !url || !apiKey) {
    return res
      .status(400)
      .json({ error: "Name, URL, and API Key are required" });
  }

  try {
    // Save the webhook document to the database
    const newWebhook = new Webhook(req.body);
    const webhookData = await newWebhook.save();
    res.status(200).json({
      success: true,
      message: "Webhook added successfully",
      data: webhookData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error saving webhook", details: error.message });
  }
};

exports.createConnection = async (req, res) => {
  try {
    const newConnection = new Connection(req.body);
    const connection = await newConnection.save();
    res.status(201).json({ id: connection._id });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Route to fetch orders from Shopify
exports.shofipyOrders = async (req, res) => {
  try {
    const response = await axios.get(
      "https://27cd06-29.myshopify.com/admin/api/2024-04/orders.json",
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": "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",
        },
      }
    );
    // console.log("resdata", response);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Server Error");
  }
};

exports.getConnectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await Connection.findById(id);
    // .populate("client")
    // .populate("integrations");
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    res.status(200).json(connection);
  } catch (error) {
    res.status(500).json({ message: "Error fetching connection", error });
  }
};

// Function to update connection by ID
exports.updateConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const updatedConnection = await Connection.findByIdAndUpdate(
      id,
      { $set: { description } }, // Use $set to update connectionName and description fields
      { new: true, runValidators: true }
    );

    if (!updatedConnection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    res.status(200).json(updatedConnection);
  } catch (error) {
    res.status(500).json({ message: "Error updating connection", error });
  }
};

exports.updateConnectionVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const { hideUnavailable } = req.body;

    const updatedConnection = await Connection.findByIdAndUpdate(
      id,
      { $set: { hideUnavailable } },
      { new: true }
    );

    if (!updatedConnection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    res.status(200).json(updatedConnection);
  } catch (error) {
    res.status(500).json({ message: "Error updating connection", error });
  }
};
