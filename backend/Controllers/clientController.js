const axios = require("axios");
const Client = require("../Schema/Client");
const logger = require("../logger");
const fs = require("fs");
const path = require("path");

// Endpoint to validate Shopify credentials
exports.addClientVerify = async (req, res) => {
  const { storeUrl, apiKey } = req.body;

  try {
    const formattedStoreUrl = `https://${storeUrl}/admin/api/2024-04/shop.json`;
    const response = await axios.get(formattedStoreUrl, {
      headers: {
        "X-Shopify-Access-Token": apiKey,
      },
    });

    if (response.status === 200) {
      logger.info("Shopify credentials verified successfully", { storeUrl });
      res
        .status(200)
        .json({ message: "Shopify credentials verified successfully!" });
    } else {
      logger.warn("Invalid Shopify credentials", { storeUrl });
      res.status(400).json({ error: "Invalid Shopify credentials" });
    }
  } catch (error) {
    logger.error("Error verifying Shopify credentials", {
      storeUrl,
      error: error.message,
    });
    res.status(500).json({ error: "Error verifying Shopify credentials" });
  }
};

// Add a new client
exports.addClient = async (req, res) => {
  const { clientName, email, phone, userId } = req.body;

  const id = userId; // Map userId to id internally

  const phoneRegex = /^[+\d\s()-]*$/;
  if (!phoneRegex.test(phone)) {
    logger.warn("Invalid phone number format", { phone });
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  const cleanedPhone = phone.replace(/[^\d\s+]/g, "");

  try {
    const newClient = new Client({
      clientName,
      email,
      phone: cleanedPhone,
      userId: id, // Use id for consistency internally
    });
    const savedClient = await newClient.save();
    logger.info("Client created successfully", { clientName, id });
    res
      .status(201)
      .json({ message: "Client created successfully", client: savedClient });
  } catch (error) {
    logger.error("Error creating client", { error: error.message, id });
    res.status(500).json({ error: "Error creating client" });
  }
};


// Get User By ID
exports.getUserById = (req, res) => {
  const { id } = req.params;

  Client.findById(id)
    .then((user) => {
      if (user) {
        console.log("user in client" , user)
        logger.info("Fetched client with ID successfully", { id, clientName:user.clientName });
        res.json(user);
      } else {
        logger.warn("User not found", { id });
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) => {
      logger.error("Error fetching user by ID", { id, error: err.message });
      res.status(400).json({ error: "Error fetching user by ID" });
    });
};

// Get Clients by User ID
exports.getClients = async (req, res) => {
  try {
    const userId = req.params.userId;
    const clients = await Client.find({ userId });
    logger.info("Fetched clients successfully", { userId, count: clients.length });
    res.status(200).send(clients);
  } catch (error) {
    logger.error("Error fetching clients", { error: error.message });
    res.status(400).send(error);
  }
};

// Get All Clients
exports.getAllClients = (req, res) => {
  Client.find()
    .then((users) => {
      logger.info("Fetched all clients successfully", { count: users.length });
      res.json(users);
    })
    .catch((error) => {
      logger.error("Error fetching all clients", { error: error.message });
      res.status(400).json("Err:" + error);
    });
};

// Add Client Integration
exports.addClientIntegration = async (req, res) => {
  const { clientId } = req.params;
  const { integrationName, selectedPlatform, storeUrl, apiKey, userId } =
    req.body;

    const id = clientId;

  try {
    const client = await Client.findById(id);
    if (!client) {
      logger.warn("Client not found", { id, userId });
      return res.status(404).json({ error: "Client not found" });
    }

    const existingIntegration = client.integrations.find(
      (integration) =>
        integration.platform === selectedPlatform &&
        integration.storeUrl === storeUrl &&
        integration.apiKey === apiKey
    );

    if (existingIntegration) {
      logger.warn(
        "Integration with the same platform, store URL, and API key already exists",
        { id, platform: selectedPlatform, storeUrl, apiKey, userId }
      );
      return res.status(400).json({
        message:
          "Integration with the same platform, store URL, and API key already exists.",
      });
    }

    const integrationData = {
      integrationName,
      platform: selectedPlatform,
      storeUrl,
      apiKey,
    };

    client.integrations.push(integrationData);
    const updatedClient = await client.save();

    logger.info("Client integration created successfully", {
      id,
      integrationName,
      platform: selectedPlatform,
      storeUrl,
      userId,
    });

    res.status(200).json({
      message: "Client integration added successfully",
      client: updatedClient,
    });
  } catch (error) {
    logger.error("Error adding client integration", {
      id,
      integrationName,
      platform: selectedPlatform,
      storeUrl,
      userId,
      error: error.message,
    });
    res.status(500).json({ error: "Error adding client integration" });
  }
};

// Fetch Client Integrations
exports.getClientIntegrations = async (req, res) => {
  const { clientId } = req.params;
  const id = clientId;

  try {
    const client = await Client.findById(id);

    if (!client) {
      logger.warn("Client not found when fetching integrations", { id });
      return res.status(404).json({ error: "Client not found" });
    }

    logger.info("Fetched client integrations successfully", { id });
    res
      .status(200)
      .json({ msg: "Connection established successfully", client });
  } catch (error) {
    logger.error("Error fetching client integrations", {
      id,
      error: error.message,
    });
    res.status(500).json({ error: "Error fetching client data" });
  }
};

// Update Client
exports.updateClient = async (req, res) => {
  try {
    const { clientName, phone, email, isActive } = req.body;
    const {id} = req.param;

    const client = await Client.findById(id);
    if (!client) {
      logger.warn("Client not found for update", { id });
      return res.status(404).send("Client not found");
    }

    client.clientName = clientName;
    client.phone = phone;
    client.email = email;
    client.isActive = isActive;

    await client.save();
    logger.info("Client updated successfully", { id });
    res.json(client);
  } catch (error) {
    logger.error("Error updating client", {
      id,
      error: error.message,
    });
    res.status(500).send("Server error");
  }
};

// Delete Client
exports.deleteClient = async (req, res) => {
  try {
    const {id} = req.params;
    const client = await Client.findById(id);
    if (!client) {
      logger.warn("Client not found for deletion", { id });
      return res.status(404).send("Client not found");
    }

    await client.remove();
    logger.info("Client deleted successfully", { id });
    res.json({ message: "Client deleted" });
  } catch (error) {
    logger.error("Error deleting client", {id });
    res.status(500).send("Server error");
  }
};

// Log Fetch
exports.getLogFile = (req, res) => {
  const logFilePath = path.join(__dirname, "../logs/app.log");

  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      logger.error("Error reading log file", { error: err.message });
      return res.status(500).json({ error: "Error reading log file" });
    }

    const logs = data
      .split("\n")
      .filter((line) => line)
      .map((line) => JSON.parse(line));
    res.json(logs);
  });
};

// Get All Logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    logger.info("Fetched all logs successfully");
    res.status(200).json(logs);
  } catch (error) {
    logger.error("Error fetching logs", { error: error.message });
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

// Delete Client Integration
exports.deleteIntegration = async (req, res) => {
  const { clientId, integrationId } = req.params;

  try {
    const client = await Client.findById(clientId);

    if (!client) {
      logger.warn("Client not found for integration deletion", { clientId });
      return res.status(404).json({ message: "Client not found" });
    }

    const updatedIntegrations = client.integrations.filter(
      (integration) => integration._id.toString() !== integrationId
    );

    if (updatedIntegrations.length === client.integrations.length) {
      logger.warn("Integration not found for deletion", {
        clientId,
        integrationId,
      });
      return res.status(404).json({ message: "Integration not found" });
    }

    client.integrations = updatedIntegrations;
    await client.save();

    logger.info("Integration deleted successfully", {
      clientId,
      integrationId,
    });
    res.status(200).json({ message: "Integration deleted successfully" });
  } catch (error) {
    logger.error("Error deleting integration", {
      clientId,
      integrationId,
      error: error.message,
    });
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateClientIntegration = async (req, res) => {
  const { clientId } = req.params;
  const { integrationName, storeUrl, apiKey } = req.body;

  try {
    const client = await Client.findById(clientId);
    if (!client) {
      logger.warn("Client not found for integration update", { clientId });
      return res.status(404).json({ error: "Client not found" });
    }

    // Find the integration to update
    const integration = client.integrations.find(
      (integration) =>
        integration.storeUrl === storeUrl && integration.apiKey === apiKey
    );

    if (!integration) {
      logger.warn("Integration not found for update", {
        clientId,
        storeUrl,
      });
      return res.status(404).json({
        message:
          "Integration not found for the specified platform and store URL.",
      });
    }

    // Update integration fields
    integration.integrationName =
      integrationName || integration.integrationName;
    integration.apiKey = apiKey || integration.apiKey;
    integration.storeUrl = storeUrl || integration.storeUrl;

    // Save updated client
    const updatedClient = await client.save();

    logger.info("Client integration updated successfully", {
      clientId,
      integrationName,
    });

    res.status(200).json({
      message: "Client integration updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    logger.error("Error updating client integration", {
      clientId,
      error: error.message,
    });
    res.status(500).json({ error: "Error updating client integration" });
  }
};

exports.deleteSingleClient = async (req, res) => {
  const { clientId } = req.params;

  try {
    const client = await Client.findByIdAndDelete(clientId);

    if (!client) {
      logger.warn("Client not found for deletion", { clientId });
      return res.status(404).json({ message: "Client not found" });
    }

    logger.info("Client deleted successfully", { clientId });
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    logger.error("Error deleting client", { clientId, error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};
