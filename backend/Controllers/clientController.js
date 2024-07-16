// Endpoint to validate Shopify credentials
const axios = require("axios");
const Client = require("../Schema/Client");
const Connection = require("../Schema/Connection");

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
  console.log(req.body);

  try {
    const newClient = new Client({
      clientName,
      email,
      phone,
      userId,
    });
    const savedClient = await newClient.save();
    res
      .status(201)
      .json({ message: "Client created successfully", client: savedClient });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Error creating client" });
  }
};

// Get User By ID
exports.getUserById = (req, res) => {
  Client.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Err :" + err));
};

// get cliens by id
exports.getClients = async (req, res) => {
  try {
    const userId = req.params.userId;
    const clients = await Client.find({ userId });
    res.status(200).send(clients);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get All Clients
exports.getAllClients = (req, res) => {
  Client.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Err:" + err));
};

exports.addClientIntegration = async (req, res) => {
  const { clientId } = req.params;
  console.log("cliented", clientId);
  const { integrationName, selectedPlatform, storeUrl, apiKey } = req.body;

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
    console.log("client", client);

    client.integrations.push(integrationData);
    const updatedClient = await client.save();

    res.status(200).json({
      message: "Client integration added successfully",

      client: updatedClient,
    });
  } catch (error) {
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
    console.log("reqq", req.body);

    // Find the client by ID
    const client = await Client.findById(req.params.id);
    console.log("updaed client", client);
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
