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

  try {
    const newClient = new Client({
      clientName,
      email,
      phone,
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
        logger.info("Fetched user by ID successfully", { id });
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

// get cliens by id
exports.getClients = async (req, res) => {
  try {
    const userId = req.params.userId;
    const clients = await Client.find({ userId });
    logger.info("Fetched clients successfully", {
      userId,
      count: clients.length,
    });
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

exports.addClientIntegration = async (req, res) => {
  const { clientId } = req.params;
  // console.log("cliented", clientId);
  const { integrationName, selectedPlatform, storeUrl, apiKey, userId } =
    req.body;

  try {
    const client = await Client.findById(clientId);
    if (!client) {
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
      const warnLog = new Log({
        message: `Integration exist with the same storeURL & apiKey: ${error.message}`,
        title: `Client Integration`,
        userId: userId,
        type: "warn",
      });
      await warnLog.save();
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
    // console.log("client", client);

    client.integrations.push(integrationData);
    const updatedClient = await client.save();

    const successLog = new Log({
      message: `Client Integration created successfully.`,
      title: `Client Integration`,
      userId: userId,
      type: "success",
    });
    await successLog.save();

    res.status(200).json({
      message: "Client integration added successfully",

      client: updatedClient,
    });
  } catch (error) {
    const errorLog = new Log({
      message: `Invalid credentials to create client Integration: ${error.message}`,
      title: `Client Integration`,
      userId: userId,
      type: "error",
    });
    await errorLog.save();
    console.error("Error adding client integration:", error);
    res.status(500).json({ error: "Error adding client integration" });
    res.status(404).json({ Err: "Resource not found" });
  }
};

exports.getClientIntegrations = async (req, res) => {
  const { clientId } = req.params;
  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res
      .status(200)
      .json({ msg: "Connection established successfully", client: client });
  } catch (error) {
    console.error("Error fetching client data:", error);
    res.status(500).json({ error: "Error fetching client data" });
  }
};
exports.updateClient = async (req, res) => {
  try {
    const { clientName, phone, email, isActive } = req.body;
    // console.log("reqq", req.body);

    // Find the client by ID
    const client = await Client.findById(req.params.id);
    // console.log("updaed client", client);
    if (!client) return res.status(404).send("Client not found");

    // Update the client's details
    client.clientName = clientName;
    client.phone = phone;
    client.email = email;
    client.isActive = isActive;

    // Save the updated client
    await client.save();
    res.json(client);
  } catch (error) {
    console.error("Error updating client:", error);
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

// logs for clients
// exports.getLogs = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const logs = await Log.find({ id }).sort({ createdAt: -1 });
//     res.status(200).json(logs);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching logs" });
//   }
// };

exports.getLogFile = (req, res) => {
  const logFilePath = path.join(__dirname, "../logs/app.log");
  console.log("chekcing");

  fs.readFile(logFilePath, "utf8", (err, data) => {
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
