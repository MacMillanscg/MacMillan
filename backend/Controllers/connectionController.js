const Connection = require("../Schema/Connection");

exports.createConnection = async (req, res) => {
  try {
    const newConnection = new Connection(req.body);
    const connection = await newConnection.save();
    res.status(201).json({ id: connection._id });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getConnectionById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const connection = await Connection.findById(id);
    // .populate("client")
    // .populate("integrations");
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }
    res.status(200).json(connection);
  } catch (error) {
    res.status(500).json({ message: "Error fetching connection", error });
  }
};

// exports.getConnections = async (req, res) => {
//   try {
//     const connections = await Connection.find();
//     if (!connections) {
//       return res.status(404).json({ message: "Connection didn't find" });
//     }
//     res.status(200).json(connections);
//   } catch (error) {
//     res.status(500).json({ message: "Error in fetcing data" });
//   }
// };
