const Connection = require("../Schema/Connection");
const axios = require("axios");
const Webhook = require("../Schema/Webhook");
const logger = require("../logger");

exports.getAllConnections = async (req, res) => {
  try {
    const connections = await Connection.find();

    logger.info("Fetched all connections successfully", {
      count: connections.length,
    });
    res.status(200).json(connections);
  } catch (error) {
    logger.error("Error fetching connections", { error: error.message });
    res.status(500).json({ error: "Error fetching connections" });
  }
};

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
    // Save the webhook document to the database
    const newWebhook = new Webhook(req.body);
    const webhookData = await newWebhook.save();

    logger.info("Webhook created successfully", { webhookId: webhookData._id });
    res.status(200).json({
      success: true,
      message: "Webhook added successfully",
      data: webhookData,
    });
  } catch (error) {
    logger.error("Error saving webhook", { error: error.message });
    res
      .status(500)
      .json({ error: "Error saving webhook", details: error.message });
  }
};

exports.createConnection = async (req, res) => {
  try {
    logger.info("Creating new connection", { requestData: req.body });

    const newConnection = new Connection(req.body);
    const connection = await newConnection.save();

    logger.info("Connection created successfully", {
      connectionId: connection._id,
    });
    res.status(201).json({ id: connection._id });
  } catch (error) {
    logger.error("Error creating connection", { error: error.message });
    res.status(500).json({ error: "Server error" });
  }
};

// Route to fetch orders from Shopify
exports.shofipyOrders = async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Fetching connection by ID", { connectionId: id });
    const connection = await Connection.findById(id);

    if (!connection) {
      logger.warn("Connection not found", { connectionId: id });
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
    logger.error("Error fetching Shopify orders", { error: error.message });
    res.status(500).send("Server Error");
  }
};

exports.getConnectionById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info("Fetching connection by ID", { connectionId: id });

    const connection = await Connection.findById(id);
    // .populate("client")
    // .populate("integrations");

    if (!connection) {
      logger.warn("Connection not found", { connectionId: id });
      return res.status(404).json({ message: "Connection not found" });
    }

    logger.info("Connection fetched successfully", { connectionId: id });
    res.status(200).json(connection);
  } catch (error) {
    logger.error("Error fetching connection", {
      connectionId: id,
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching connection", error: error.message });
  }
};

// Function to update connection by ID
exports.updateConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    logger.info("Updating connection", { connectionId: id, description });

    const updatedConnection = await Connection.findByIdAndUpdate(
      id,
      { $set: { description } },
      { new: true, runValidators: true }
    );

    if (!updatedConnection) {
      logger.warn("Connection not found for update", { connectionId: id });
      return res.status(404).json({ message: "Connection not found" });
    }

    logger.info("Connection updated successfully", { connectionId: id });
    res.status(200).json(updatedConnection);
  } catch (error) {
    logger.error("Error updating connection", {
      connectionId: id,
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error updating connection", error: error.message });
  }
};

exports.updateConnectionVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const { hideUnavailable } = req.body;
    logger.info("Updating connection version", {
      connectionId: id,
      hideUnavailable,
    });

    const updatedConnection = await Connection.findByIdAndUpdate(
      id,
      { $set: { hideUnavailable } },
      { new: true }
    );

    if (!updatedConnection) {
      logger.warn("Connection not found for version update", {
        connectionId: id,
      });
      return res.status(404).json({ message: "Connection not found" });
    }

    logger.info("Connection version updated successfully", {
      connectionId: id,
    });
    res.status(200).json(updatedConnection);
  } catch (error) {
    logger.error("Error updating connection version", {
      connectionId: id,
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error updating connection", error: error.message });
  }
};

// Controller to delete a connection by ID
exports.deleteConnectionById = async (req, res) => {
  const { id } = req.params;

  try {
    logger.info("Attempting to delete connection", { connectionId: id });
    const deletedConnection = await Connection.findByIdAndDelete(id);

    if (!deletedConnection) {
      logger.warn("Connection not found for deletion", { connectionId: id });
      return res.status(404).json({ message: "Connection not found" });
    }

    logger.info("Connection deleted successfully", { connectionId: id });
    res.status(200).json({ message: "Connection deleted successfully" });
  } catch (error) {
    logger.error("Error deleting connection", {
      connectionId: id,
      error: error.message,
    });
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyEShipperCredentials = async (req, res) => {
  const { url, principal, credential } = req.body;
  logger.info("Verifying eShipper credentials", { url, principal }); // Log the credentials being verified

  try {
    const response = await axios.post(url, {
      principal,
      credential,
    });

    logger.info("eShipper authentication successful", { token: response.data }); // Log successful authentication
    res.json({ token: response.data });
  } catch (error) {
    logger.error("Authentication failed for eShipper", {
      error: error.message,
    }); // Log the error
    res.status(500).json({ error: "Authentication failed" });
  }
};
