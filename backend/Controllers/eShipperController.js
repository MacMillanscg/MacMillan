const axios = require("axios");
const Client = require("../Schema/Client");

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

exports.addEShipperRecord = async (req, res) => {
  const { clientId } = req.params;
  console.log("clientIDDD", clientId);
  const {
    integrationName,
    selectedPlatform,
    eShipperStoreUrl,
    username,
    password,
  } = req.body;
  try {
    const client = await Client.findById(clientId);
    const integrationData = {
      integrationName,
      platform: selectedPlatform,
      eShipperStoreUrl,
      username,
      password,
    };
    console.log("client", client);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    client.integrations.push(integrationData);
    const updatedClient = await client.save();

    res.status(200).json({
      message: "Record added successfully",
      eShipperData: updatedClient,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add record" });
  }
};
