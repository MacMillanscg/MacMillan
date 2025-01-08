const Connection = require("../Schema/Connection");
const Webhook = require("../Schema/Webhook");
const Client = require("../Schema/Client");
const axios = require("axios");
const mongoose = require("mongoose");
const logger = require("../logger");

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

// Create a new connection
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

// Add a connection step
exports.addConnectionStep = async (req, res) => {
  const {
    connectionId,
    connectionName,
    webhookTrigger,
    managementTrigger,
    scheduleDetails,
    shopifyDetails,
    option,
  } = req.body;

  try {
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    const newConnectionStep = {
      connectionId,
      connectionName,
      webhookTrigger: webhookTrigger || null,
      managementTrigger: managementTrigger || null,
      scheduleDetails: scheduleDetails || null,
      shopifyDetails,
      option,
    };

    connection.connectionRule.push(newConnectionStep);

    const updatedConnection = await connection.save();
    logger.info("Connection step added successfully", { connectionId });
    res.status(201).json(updatedConnection);
  } catch (error) {
    logger.error("Error creating connection step", { error: error.message });
    res.status(500).json({ error: "Server error while creating connection step" });
  }
};

// Get all connection steps
exports.getAllConnectionsStep = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await Connection.findOne(
      { _id: id },
      { connectionRule: 1 }
    );

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    logger.info("Fetched all connection steps successfully", { connectionId: id });
    res.status(200).json({
      connectionRule: connection.connectionRule,
    });
  } catch (error) {
    logger.error("Error fetching connection steps", { error: error.message });
    res
      .status(500)
      .json({ error: "Server error while fetching connection steps" });
  }
};

// Delete a connection step
exports.deleteConnectionStep = async (req, res) => {
  const { id, stepId } = req.params;

  try {
    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    const stepIndex = connection.connectionRule.findIndex(
      (step) => step._id.toString() === stepId
    );

    if (stepIndex === -1) {
      return res.status(404).json({ error: "Step not found" });
    }

    connection.connectionRule.splice(stepIndex, 1);

    await connection.save();

    logger.info("Connection step deleted successfully", { connectionId: id, stepId });
    res.status(200).json({ message: "Step deleted successfully", connection });
  } catch (error) {
    logger.error("Error deleting connection step", { error: error.message });
    res
      .status(500)
      .json({ error: "Server error while deleting connection step" });
  }
};

// Update a connection step
exports.updateConnectionStep = async (req, res) => {
  const {
    connectionId,
    connectionName,
    webhookTrigger,
    managementTrigger,
    scheduleDetails,
    shopifyDetails,
    option,
  } = req.body;

  const { stepId } = req.params;

  try {
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    const stepIndex = connection.connectionRule.findIndex(
      (step) => step._id.toString() === stepId
    );

    if (stepIndex === -1) {
      return res.status(404).json({ error: "Step not found" });
    }

    connection.connectionRule[stepIndex] = {
      ...connection.connectionRule[stepIndex].toObject(),
      connectionName: connectionName || connection.connectionRule[stepIndex].connectionName,
      webhookTrigger: webhookTrigger || connection.connectionRule[stepIndex].webhookTrigger,
      managementTrigger: managementTrigger || connection.connectionRule[stepIndex].managementTrigger,
      scheduleDetails: scheduleDetails || connection.connectionRule[stepIndex].scheduleDetails,
      shopifyDetails: shopifyDetails || connection.connectionRule[stepIndex].shopifyDetails,
      option: option || connection.connectionRule[stepIndex].option,
    };

    const updatedConnection = await connection.save();

    logger.info("Connection step updated successfully", { connectionId, stepId });
    res.status(200).json({
      message: "Step updated successfully",
      updatedStep: connection.connectionRule[stepIndex],
    });
  } catch (error) {
    logger.error("Error updating connection step", { error: error.message });
    res.status(500).json({ error: "Server error while updating step" });
  }
};

// Clone a connection step
exports.cloneConnectionStep = async (req, res) => {
  const { id, stepId } = req.params;

  try {
    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    const stepToClone = connection.connectionRule.find(
      (step) => step._id.toString() === stepId
    );

    if (!stepToClone) {
      return res.status(404).json({ error: "Step not found" });
    }

    const clonedStep = {
      ...stepToClone._doc,
      _id: new mongoose.Types.ObjectId(),
      connectionName: `${stepToClone.connectionName} (Copy)`,
    };

    connection.connectionRule.push(clonedStep);

    const updatedConnection = await connection.save();

    logger.info("Connection step cloned successfully", { connectionId: id, stepId });
    res.status(201).json({
      message: "Step cloned successfully",
      clonedStep,
      updatedConnection,
    });
  } catch (error) {
    logger.error("Error cloning connection step", { error: error.message });
    res.status(500).json({ error: "Server error while cloning step" });
  }
};

// Verify eShipper credentials
exports.verifyEShipperCredentials = async (req, res) => {
  const { url, principal, credential } = req.body;

  try {
    logger.info("Verifying eShipper credentials", { url, principal });
    const response = await axios.post(url, {
      principal,
      credential,
    });

    logger.info("eShipper authentication successful", { token: response.data });
    res.json({ token: response.data });
  } catch (error) {
    logger.error("Authentication failed for eShipper", { error: error.message });
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Add eShipper record to a client
exports.addEShipperRecord = async (req, res) => {
  const { clientId } = req.params;
  const {
    integrationName,
    selectedPlatform,
    eShipperStoreUrl,
    username,
    password,
  } = req.body;

  try {
    logger.info("Adding eShipper record for client", { clientId });
    const client = await Client.findById(clientId);

    if (!client) {
      logger.warn("Client not found for eShipper record", { clientId });
      return res.status(404).json({ error: "Client not found" });
    }

    const integrationData = {
      integrationName,
      platform: selectedPlatform,
      eShipperStoreUrl,
      username,
      password,
    };

    client.integrations.push(integrationData);
    const updatedClient = await client.save();

    logger.info("eShipper record added successfully", { clientId });
    res.status(200).json({
      message: "Record added successfully",
      eShipperData: updatedClient,
    });
  } catch (error) {
    logger.error("Failed to add eShipper record", { error: error.message });
    res.status(500).json({ error: "Failed to add record" });
  }
};
