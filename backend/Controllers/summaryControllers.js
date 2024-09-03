const axios = require("axios");

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
