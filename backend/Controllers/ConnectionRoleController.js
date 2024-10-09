const ConnectionRole = require("../Schema/ConnectionRole");

// Create a new connection
exports.addConnectionRole = async (req, res) => {
  const {
    connectionId,
    connectionName,
    webhookTrigger,
    managementTrigger,
    schedule,
    cronExpression,
  } = req.body;
  console.log("reqbodydaf", req.body);

  try {
    const newConnection = new ConnectionRole({
      connectionId,
      connectionName,
      webhookTrigger,
      managementTrigger,
      schedule,
      cronExpression,
    });

    const savedConnection = await newConnection.save();

    res.status(201).json(savedConnection);
  } catch (error) {
    console.error("Error creating connection:", error);
    res.status(500).json({ error: "Server error while creating connection" });
  }
};

exports.getAllConnections = async (req, res) => {
  try {
    const connections = await Connection.find(); // Fetch all connections
    res.status(200).json(connections);
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ message: "Server error" });
  }
};
