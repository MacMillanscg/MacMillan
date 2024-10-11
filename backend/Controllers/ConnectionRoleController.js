const Connection = require("../Schema/Connection");

// Create a new connection
exports.addConnectionStep = async (req, res) => {
  const { connectionId, connectionName, webhookTrigger } = req.body;
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

  try {
    // Find the main connection by ID and populate the sub-schema (ConnectionRule)
    const connection = await Connection.findById(id)
      .populate("connectionRule.connectionId") // Populate the connectionId if it's a reference
      .exec(); // Execute the query

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    // Send the main connection along with its steps (sub-schema data)
    res.status(200).json(connection);
  } catch (error) {
    console.error("Error fetching connection data:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching connection data" });
  }
};
