// Endpoint to validate Shopify credentials
const axios = require("axios");
const Client = require("../Schema/Client");
const Log = require("../Schema/Log");
const logger = require("../logger");

const fs = require("fs");
const path = require("path");

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
      res
        .status(200)
        .json({ message: "Shopify credentials verified successfully!" });
    } else {
      res.status(400).json({ error: "Invalid Shopify credentials" });
    }
  } catch (error) {
    console.error("Error verifying Shopify credentials:", error);
    res.status(500).json({ error: "Error verifying Shopify credentials" });
  }
};

exports.addClient = async (req, res) => {
  const { clientName, email, phone, userId } = req.body; // also pass url key api token
  // console.log(userId);
  const phoneRegex = /^[+\d\s()-]*$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  // Normalize phone number (optional)
  const cleanedPhone = phone.replace(/[^\d\s+]/g, "");

  try {
    const newClient = new Client({
      clientName,
      email,
      phone: cleanedPhone,
      userId,
    });
    const savedClient = await newClient.save();
    // Log successful client creation
    const successLog = new Log({
      message: `Client ${clientName} created successfully.`,
      title: `Client`,
      userId: userId,
      type: "success",
    });
    await successLog.save();
    res
      .status(201)
      .json({ message: "Client created successfully", client: savedClient });
  } catch (error) {
    // Log the error
    const errorLog = new Log({
      message: `Error creating client: ${error.message}`,
      title: `Client`,
      userId: userId,
      type: "error",
    });
    await errorLog.save();
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Error creating client" });
  }
};

// Get User By ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  console.log("idddd ", id);

  Client.findById(id)
    .then((user) => {
      if (user) {
        const logEntry = new Log({
          message: `Fetched client with ID: ${id} successfully`,
          title: "Fetch Success",
          type: "success",
          userId: id,
        });

        logEntry.save();

        logger.info("Fetched client with connection successfully", { id });
        res.json(user);
      } else {
        const logEntry = new Log({
          message: `User not found with ID: ${id}`,
          title: "User Not Found",
          type: "warning",
          userId: id,
        });

        logEntry.save();
        logger.warn("User not found", { id });
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) => {
      const logEntry = new Log({
        message: `Error fetching user with ID: ${id}`,
        title: "Fetch Error",
        type: "error",
        userId: id,
      });

      logEntry.save();
      logger.error("Error fetching user by ID", { id, error: err.message });
      res.status(400).json({ error: "Error fetching user by ID" });
    });
};

// get cliens by id
exports.getClients = async (req, res) => {
  try {
    const userId = req.params.userId;
    const clients = await Client.find({ userId });
    // console.log("clients", clients);
    // logger.info("Fetched clients successfully", {
    //   userId,
    //   count: clients.length,
    // });
    res.status(200).send(clients);
  } catch (error) {
    // logger.error("Error fetching clients", { error: error.message });
    res.status(400).send(error);
  }
};

// Get All Clients
exports.getAllClients = (req, res) => {
  Client.find()
    .then((users) => {
      // logger.info("Fetched all clients successfully", { count: users.length });
      res.json(users);
    })
    .catch((error) => {
      // logger.error("Error fetching all clients", { error: error.message });
      res.status(400).json("Err:" + error);
    });
};

exports.addClientIntegration = async (req, res) => {
  const { clientId } = req.params;
  const { integrationName, selectedPlatform, storeUrl, apiKey, userId } =
    req.body;

  try {
    const client = await Client.findById(clientId);
    if (!client) {
      logger.warn("Client not found", { clientId, userId });
      return res.status(404).json({ error: "Client not found" });
    }

    // Check if integration already exists
    const existingIntegration = client.integrations.find(
      (integration) =>
        integration.platform === selectedPlatform &&
        integration.storeUrl === storeUrl &&
        integration.apiKey === apiKey
    );

    if (existingIntegration) {
      logger.warn(
        "Integration with the same platform, store URL, and API key already exists",
        {
          clientId,
          platform: selectedPlatform,
          storeUrl,
          apiKey,
          userId,
        }
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
      clientId,
      integrationName,
      platform: selectedPlatform,
      storeUrl,
      apiKey,
      userId,
    });

    res.status(200).json({
      message: "Client integration added successfully",
      client: updatedClient,
    });
  } catch (error) {
    logger.error("Error adding client integration", {
      clientId,
      integrationName,
      platform: selectedPlatform,
      storeUrl,
      apiKey,
      userId,
      error: error.message,
    });
    res.status(500).json({ error: "Error adding client integration" });
  }
};

exports.getClientIntegrations = async (req, res) => {
  const { clientId } = req.params;

  try {
    const client = await Client.findById(clientId);

    if (!client) {
      // logger.warn("Client not found when fetching integrations", { clientId });
      return res.status(404).json({ error: "Client not found" });
    }

    // logger.info("Fetched client integrations successfully", { clientId });
    res
      .status(200)
      .json({ msg: "Connection established successfully", client });
  } catch (error) {
    // logger.error("Error fetching client integrations", {
    //   clientId,
    //   error: error.message,
    // });
    res.status(500).json({ error: "Error fetching client data" });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { clientName, phone, email, isActive } = req.body;

    // Find the client by ID
    const client = await Client.findById(req.params.id);
    if (!client) {
      logger.warn("Client not found for update", { clientId: req.params.id });
      return res.status(404).send("Client not found");
    }

    // Update the client's details
    client.clientName = clientName;
    client.phone = phone;
    client.email = email;
    client.isActive = isActive;

    // Save the updated client
    await client.save();

    logger.info("Client updated successfully", { clientId: req.params.id });
    res.json(client);
  } catch (error) {
    logger.error("Error updating client", {
      clientId: req.params.id,
      error: error.message,
    });
    res.status(500).send("Server error");
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).send("Client not found");

    await client.remove();
    res.json({ message: "Client deleted" });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// controllers/clientController.js

// controllers/clientController.js

exports.updateClientIntegration = async (req, res) => {
  const { clientId } = req.params;
  const { integrationName, storeUrl, apiKey } = req.body;

  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Find the existing integration to update
    const integration = client.integrations.find(
      (integration) =>
        integration.storeUrl === storeUrl && integration.storeUrl === storeUrl
    );

    if (!integration) {
      return res.status(404).json({
        message:
          "Integration not found for the specified platform and store URL.",
      });
    }

    // Update the integration fields
    integration.integrationName =
      integrationName || integration.integrationName;
    integration.apiKey = apiKey || integration.apiKey;
    integration.storeUrl = storeUrl || integration.storeUrl;

    // Save the updated client document
    const updatedClient = await client.save();

    res.status(200).json({
      message: "Client integration updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating client integration" });
  }
};

// delete client integration
exports.deleteIntegration = async (req, res) => {
  const { clientId, integrationId } = req.params;

  try {
    // Find the client by ID
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Filter out the integration with the specified integrationId
    const updatedIntegrations = client.integrations.filter(
      (integration) => integration._id.toString() !== integrationId
    );

    // Check if the integration existed
    if (updatedIntegrations.length === client.integrations.length) {
      return res.status(404).json({ message: "Integration not found" });
    }

    // Update the client integrations and save
    client.integrations = updatedIntegrations;
    await client.save();

    return res
      .status(200)
      .json({ message: "Integration deleted successfully" });
  } catch (error) {
    console.error("Error deleting integration:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getLogFile = (req, res) => {
  const logFilePath = path.join(__dirname, "../logs/app.log");
  // console.log("chekcing");

  fs.readFile(logFilePath, "utf8", (err, data) => {
    // console.log("data", data);
    if (err) {
      return res.status(500).json({ error: "Error reading log file" });
    }

    // Split by lines and parse each line as JSON
    const logs = data
      .split("\n")
      .filter((line) => line)
      .map((line) => JSON.parse(line));
    res.json(logs);
  });
};

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }); // Sort by newest logs first
    console.log("Logs", logs);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};
