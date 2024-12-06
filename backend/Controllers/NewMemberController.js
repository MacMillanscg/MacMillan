const bcrypt = require("bcrypt");
const User = require("../Schema/userModel");
const logger = require("../logger");

exports.addMember = async (req, res) => {
  const { name, email, role, createdBy } = req.body;

  try {
    // Ensure that role is valid
    if (!["admin", "member", "guest"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      logger.warn("Add member attempt with existing email", { email });
      return res
        .status(400)
        .send({ success: false, message: "User already exists" });
    }

    // Create a new user with no password (only name, email, role)
    const newUser = new User({
      name,
      email,
      role,
      createdBy,
    });

    // Save the new user to the database
    await newUser.save();

    logger.info("New member added successfully", { email, role });

    return res.status(200).json({
      success: true,
      message: "New member added successfully",
      user: newUser,
    });
  } catch (error) {
    logger.error("Error adding new member", {
      message: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ success: false, message: "Error adding new member" });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    // Fetch all members and populate the `createdBy` field with specific user details
    const members = await User.find()

      .populate("createdBy", "name email role") // Populating creator's details (you can select specific fields you need)
      .exec();

    console.log("meber", members);

    if (!members || members.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No members found" });
    }

    // Send the response with the populated members data
    res.status(200).json({ success: true, members });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ success: false, message: "Error fetching members" });
  }
};
