const Connection = require("../Schema/Connection");
const Webhook = require("../Schema/Webhook");
const axios = require("axios");
const logger = require("../logger");
const fs = require("fs");
const path = require("path");


// Get all connections
exports.getAllConnections = async (req, res) => {
  try {
    const connections = await Connection.find();
    logger.info("Fetched all connections successfully");
    res.status(200).json(connections);
  } catch (error) {
    logger.error("Error fetching connections", { error: error.message });
    res.status(500).json({ error: "Error fetching connections" });
  }
};

// Create a new webhook
exports.createWebhook = async (req, res) => {
  const { name, url, apiKey } = req.body;

  if (!name || !url || !apiKey) {
    logger.warn("Missing required fields for webhook creation", {
      fields: { name, url, apiKey },
    });
    return res
      .status(400)
      .json({ error: "Name, URL, and API Key are required" });
  }

  try {
    const newWebhook = new Webhook(req.body);
    const webhookData = await newWebhook.save();

    logger.info("Webhook created successfully", { id: webhookData._id });
    res.status(200).json({
      success: true,
      message: "Webhook added successfully",
      data: webhookData,
    });
  } catch (error) {
    logger.error("Error saving webhook", {id:webhookData.Id, error: error.message });
    res
      .status(500)
      .json({ error: "Error saving webhook", details: error.message });
  }
};

// Create a new connection
exports.createConnection = async (req, res) => {
  try {
    logger.info("Creating new connection", { requestData: req.body });

    const newConnection = new Connection(req.body);
    const connection = await newConnection.save();

    logger.info("Connection created successfully", {
      id: connection._id,
    });
    res.status(201).json({ id: connection._id });
  } catch (error) {
    logger.error("Error creating connection", { error: error.message });
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch orders from Shopify
exports.shofipyOrders = async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Fetching connection by ID", { id });
    const connection = await Connection.findById(id);

    if (!connection) {
      logger.warn("Connection not found", {  id });
      return res.status(404).json({ message: "Connection not found" });
    }

    const integration = connection.integrations[0];
    const { apiKey, storeUrl } = integration;

    logger.info("Fetching Shopify orders", { storeUrl, integration });
    const response = await axios.get(
      `https://${storeUrl}/admin/api/2024-04/orders.json`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": apiKey,
        },
      }
    );

    logger.info("Shopify orders fetched successfully", { storeUrl });
    res.json(response.data);
  } catch (error) {
    logger.error("Error fetching Shopify orders", {id, error: error.message });
    res.status(500).send("Server Error");
  }
};

// Get connection by ID
exports.getConnectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await Connection.findById(id);
    console.log("connections" , connection)

    if (!connection) {
      logger.warn("Connection not found", {  id });
      return res.status(404).json({ message: "Connection not found" });
    }

    logger.info("Connection fetched successfully", {id, connectionName:connection.connectionName });
    res.status(200).json(connection);
  } catch (error) {
    logger.error("Error fetching connection", {
       id,
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching connection", error: error.message });
  }
};

// Update a connection by ID
exports.updateConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    logger.info("Updating connection", { id, description });

    const updatedConnection = await Connection.findByIdAndUpdate(
      id,
      { $set: { description } },
      { new: true, runValidators: true }
    );

    if (!updatedConnection) {
      logger.warn("Connection not found for update", { id });
      return res.status(404).json({ message: "Connection not found" });
    }

    logger.info("Connection updated successfully", { id });
    res.status(200).json(updatedConnection);
  } catch (error) {
    logger.error("Error updating connection", {
     id,
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error updating connection", error: error.message });
  }
};

// Update connection version
exports.updateConnectionVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const { hideUnavailable } = req.body;
    logger.info("Updating connection version", {
     id,
      hideUnavailable,
    });

    const updatedConnection = await Connection.findByIdAndUpdate(
      id,
      { $set: { hideUnavailable } },
      { new: true }
    );

    if (!updatedConnection) {
      logger.warn("Connection not found for version update", {
         id,
      });
      return res.status(404).json({ message: "Connection not found" });
    }

    logger.info("Connection version updated successfully", {
     id,
    });
    res.status(200).json(updatedConnection);
  } catch (error) {
    logger.error("Error updating connection version", {
       id,
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error updating connection", error: error.message });
  }
};

// Delete a connection by ID
exports.deleteConnectionById = async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Attempting to delete connection", { id });
    const deletedConnection = await Connection.findByIdAndDelete(id);

    if (!deletedConnection) {
      logger.warn("Connection not found for deletion", { connectionId: id });
      return res.status(404).json({ message: "Connection not found" });
    }

    logger.info("Connection deleted successfully", { id });
    res.status(200).json({ message: "Connection deleted successfully" });
  } catch (error) {
    logger.error("Error deleting connection", {
       id,
      error: error.message,
    });
    res.status(500).json({ message: "Server error" });
  }
};

// Verify eShipper credentials
exports.verifyEShipperCredentials = async (req, res) => {
  const { url, principal, credential } = req.body;
  logger.info("Verifying eShipper credentials", { url, principal });

  try {
    const response = await axios.post(url, {
      principal,
      credential,
    });

    logger.info("eShipper authentication successful", { token: response.data });
    res.json({ token: response.data });
  } catch (error) {
    logger.error("Authentication failed for eShipper", {
      error: error.message,
    });
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Publish a new version for a connection
exports.publishVersion = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await Connection.findById(id);
    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    const latestVersionNumber =
      connection.versions.length > 0
        ? connection.versions[connection.versions.length - 1].versionNumber
        : 0;
    const newVersionNumber = latestVersionNumber + 1;

    connection.versions.push({
      versionNumber: newVersionNumber,
    });

    await connection.save();

    logger.info("New version published successfully", {
       id,
      version: newVersionNumber,
    });

    res.status(200).json({
      message: "New version published successfully!",
      version: newVersionNumber,
    });
  } catch (error) {
    logger.error("Error publishing version", { id ,error: error.message });
    res.status(500).json({ error: "Failed to publish the version" });
  }
};


// Define the network base path
const BASE_PATH = "\\\\vm-mac-fs01\\Shared\\Interface\\Shopify";
// const BASE_PATH = "\\VM-MAC-DEV01\Users\developer.MACMILLANSCG\Documents\shopifyOrders"
// const BASE_PATH = "\\\\DESKTOP-22QU5F1\\ShopifyOrders";


exports.exportOrders = (req, res) => {
  const { folderName, xmlOrders, csvContent } = req.body; // Expect 'folderName' for subfolder creation

  // Validate input
  if (!folderName || (!xmlOrders && !csvContent)) {
    return res.status(400).json({
      message: "Invalid request. Ensure folderName and orders are provided.",
    });
  }

  try {
    // Construct the full folder path
    const folderPath = path.join(BASE_PATH, folderName);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Save XML orders
    if (xmlOrders && xmlOrders.length > 0) {
      xmlOrders.forEach(({ fileName, content }) => {
        const filePath = path.join(folderPath, fileName);
        fs.writeFileSync(filePath, content, "utf8");
      });
    }

    // Save CSV content
    if (csvContent) {
      const filePath = path.join(folderPath, `orders_${Date.now()}.csv`);
      fs.writeFileSync(filePath, csvContent, "utf8");
    }

    res.status(200).json({
      message: "Orders exported successfully to the network path.",
    });
  } catch (error) {
    console.error("Error exporting orders:", error);
    res.status(500).json({ message: "Failed to export orders.", error });
  }
};


