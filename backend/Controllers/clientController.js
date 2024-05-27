// Endpoint to validate Shopify credentials
const axios = require("axios");
const Client = require("../Schema/Client");

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
  const { clientName, storeUrl, apiKey } = req.body;
  console.log(req.body);

  try {
    const newClient = new Client({ clientName, storeUrl, apiKey });
    const savedClient = await newClient.save();
    res
      .status(201)
      .json({ message: "Client created successfully", client: savedClient });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Error creating client" });
  }
};

// Get All Clients
exports.getAllClients = (req, res) => {
  Client.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Err:" + err));
};
