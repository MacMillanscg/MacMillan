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
