const Connection = require("../Schema/Connection");

// Create a new connection
exports.addConnectionStep = async (req, res) => {
  const { connectionId, connectionName, webhookTrigger, shopifyDetails } =
    req.body;
  console.log("reqbodydaf", req.body);

  try {
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    const newConnectionStep = {
      connectionId,
      connectionName,
      webhookTrigger,
      shopifyDetails,
    };

    connection.connectionRule.push(newConnectionStep);

    const updatedConnection = await connection.save();
    res.status(201).json(updatedConnection);
  } catch (error) {
    console.error("Error creating connection:", error);
    res.status(500).json({ error: "Server error while creating connection" });
  }
};

exports.getAllConnectionsStep = async (req, res) => {
  const { id } = req.params;
  console.log("getAllconecton", id);

  try {
    // Find the main connection by ID, but only select the connectionId and the sub-schema (ConnectionRule)
    // const connection = await Connection.findById(id);
    const connection = await Connection.findOne(
      { _id: id },
      { connectionRule: 1 }
    );
    console.log("signleConnnecitn", connection);
    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json({
      connectionRule: connection.connectionRule,
    });
  } catch (error) {
    console.error("Error fetching connection steps:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching connection steps" });
  }
};

exports.deleteConnectionStep = async (req, res) => {
  const { id, stepId } = req.params;
  console.log("connectionId in delete", id);
  console.log("step id in delete", stepId);

  try {
    // Find the connection by ID
    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    // Find the index of the step to delete
    const stepIndex = connection.connectionRule.findIndex(
      (step) => step._id.toString() === stepId
    );

    if (stepIndex === -1) {
      return res.status(404).json({ error: "Step not found" });
    }

    // Remove the step from the array
    connection.connectionRule.splice(stepIndex, 1);

    // Save the updated connection
    await connection.save();

    res.status(200).json({ message: "Step deleted successfully", connection });
  } catch (error) {
    console.error("Error deleting connection step:", error);
    res
      .status(500)
      .json({ error: "Server error while deleting connection step" });
  }
};
