const axios = require("axios");
const Connection = require("../Schema/Connection");

exports.verifyEShipperCredential = async (req, res) => {
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

// Route to fetch orders from Shopify
exports.shofipyOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    const integration = connection.integrations[0];
    console.log(integration);
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
