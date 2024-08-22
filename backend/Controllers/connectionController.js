const Connection = require("../Schema/Connection");
const ShopifyDetails = require("../Schema/ShopifySchema");
const axios = require("axios");
const Webhook = require("../Schema/Webhook");
const fs = require("fs");
const path = require("path");

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
    console.log("reqb", req.body);
    const newConnection = new Connection(req.body);
    const connection = await newConnection.save();
    res.status(201).json({ id: connection._id });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Route to fetch orders from Shopify
exports.shofipyOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    const integration = connection.integrations[0];
    const { apiKey, storeUrl } = integration;

    const response = await axios.get(
      `https://${storeUrl}/admin/api/2024-04/orders.json`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": apiKey,
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

// Controller to delete a connection by ID
exports.deleteConnectionById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedConnection = await Connection.findByIdAndDelete(id);

    if (!deletedConnection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    res.status(200).json({ message: "Connection deleted successfully" });
  } catch (error) {
    console.error("Error deleting connection:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.decodeData = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Debugging line

    const base64Data = req.body.data;

    if (!base64Data) {
      return res.status(400).json({ message: "No Base64 data provided" });
    }

    // Decode the Base64 string
    const buffer = Buffer.from(base64Data, "base64");

    // Define the file path
    const filePath = path.join(__dirname, "output.pdf");

    // Save the decoded data as a PDF file
    fs.writeFileSync(filePath, buffer);

    // Respond with a success message
    res.json({ message: "PDF decoded and saved successfully", filePath });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error decoding or saving the PDF:", error);

    // Respond with an error message
    res.status(500).json({
      message: "Failed to decode and save PDF.",
      error: error.message,
    });
  }
};

exports.verifyEShipperCredentials = async (req, res) => {
  const { url, principal, credential } = req.body;
  console.log(req.body);
  try {
    const response = await axios.post(url, {
      principal,
      credential,
    });
    console.log(response);

    res.json({ token: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
