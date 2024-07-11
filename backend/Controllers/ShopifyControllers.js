const Connection = require("../Schema/Connection");

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

// get shopify connection
exports.getShopifyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await Connection.findById(id).select("shopifyDetails");

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json(connection.shopifyDetails);
  } catch (error) {
    console.error("Error fetching Shopify details:", error);
    res.status(500).json({ error: error.message });
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
