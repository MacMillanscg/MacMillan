const Connection = require("../Schema/Connection");
const Transaction = require("../Schema/Transaction");

// create shopify connection
exports.createShopifyConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { shopifyTitle, shopifyDetails } = req.body;

    const updatedConnection = await Connection.findByIdAndUpdate(
      id,
      { shopifyDetails: { shopifyTitle, shopifyDetails } },
      { new: true, runValidators: true }
    );

    if (!updatedConnection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json({
      message: "Shopify created successfully",
      shopify: updatedConnection,
    });
  } catch (error) {
    console.error("Error updating Shopify details:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.addXmlConvertion = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, action } = req.body;
    const updatedXMlconversion = await Connection.findByIdAndUpdate(
      id,
      { conversionsXML: { name, description, action } },
      { new: true, runValidators: true }
    );

    if (!updatedXMlconversion) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json({
      message: "XMLConvertion created successfully",
      xmlConvertion: updatedXMlconversion,
    });
    console.log("req,bldy", req.body);
  } catch (error) {
    console.error("Error in conversion of xml file");
    res.status(500).json({ error: error.message });
  }
};
// get shopify connection
exports.getShopifyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await Connection.findById(id).select("shopifyDetails");
    console.log("connection shopify", connection);

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json(connection.shopifyDetails);
  } catch (error) {
    console.error("Error fetching Shopify details:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getXMLConversion = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await Connection.findById(id).select("conversionsXML");
    console.log("Conversion Data:", connection);
    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }
    res.status(200).json(connection);
  } catch (error) {
    console.error("Error in fetching details:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.addAllOrders = async (req, res) => {
  const { clientId, integrationId, type, shopifyId } = req.body;
  console.log("ordersss", req.body);

  try {
    const transaction = new Transaction({
      clientId,
      integrationId,
      type,
      // shopifyId,
    });

    const transactionData = await transaction.save();
    res.status(201).json({
      message: "Transaction saved successfully",
      transaction: transactionData,
    });
    console.log("trans", transactionData);
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({ error: "Failed to save transaction" });
  }
};

exports.deleteShopifyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedConnection = await Connection.findByIdAndUpdate(
      id,
      { $unset: { shopifyDetails: "" } }, // Unset the shopifyDetails field
      { new: true, runValidators: true }
    );

    if (!updatedConnection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json({
      message: "shopify deleted successfully",
      updatedConnectionShopify: updatedConnection,
    });
  } catch (error) {
    console.error("Error deleting Shopify details:", error);
    res.status(500).json({ error: error.message });
  }
};
