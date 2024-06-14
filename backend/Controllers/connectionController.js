const Connection = require("../Schema/Connection");

exports.createConnection = async (req, res) => {
  try {
    const newConnection = new Connection(req.body);
    const connection = await newConnection.save();
    res.status(201).json(connection);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
