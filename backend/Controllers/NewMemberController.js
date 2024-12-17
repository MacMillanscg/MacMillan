const bcrypt = require("bcrypt");
const User = require("../Schema/userModel");
const logger = require("../logger");
const NewMember = require("../Schema/newMemberSchema");

exports.addMember = async (req, res) => {
  const { name, email, role, createdBy } = req.body;

  try {
    // Ensure that role is valid
    if (!["admin", "member", "guest"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // Check if the super admin's name and email are being used
    console.log("createdBy", createdBy);
    const superAdmin = await User.findById(createdBy);
    if (superAdmin && superAdmin.name === name && superAdmin.email === email) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot create a new member with the super admin's name and email.",
      });
    }
    console.log("superAdmin", superAdmin);

    // Step 1: Check if a user exists with the same name and email
    const existingUser = await User.findOne({ name, email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "No account found with this name and email.",
      });
    }

    // Step 2: Check if the new member already exists in the NewMember collection
    const existingMember = await NewMember.findOne({ name, email, createdBy });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Member already exists.",
      });
    }

    // Step 3: Update the role in the User collection
    const updatedUser = await User.findOneAndUpdate(
      { name, email }, // Find the user by name and email
      { role }, // Update the role
      { new: true, runValidators: true } // Return the updated user
    );
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Error updating user role. User not found.",
      });
    }

    // Step 4: Create a new member in the NewMember schema with the same role
    const newMember = new NewMember({
      name,
      email,
      role, // Same role as in the User schema
      createdBy,
    });

    // Save the new member to the NewMember collection
    await newMember.save();

    return res.status(200).json({
      success: true,
      message: "New member added successfully.",
      newMember,
    });
  } catch (error) {
    console.error("Error adding new member:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding new member",
    });
  }
};

exports.getAllMembers = async (req, res) => {
  const { createdBy } = req.params;

  try {
    const newMembers = await NewMember.find({ createdBy });

    if (newMembers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new members found.",
        newMembers: [], // Return an empty array
      });
    }
    res.status(200).json({
      success: true,
      message: "New members fetched successfully",
      newMembers,
    });
  } catch (error) {
    console.error("Error fetching new members:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching new members",
    });
  }
};

exports.getSingleMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await NewMember.findById(id).populate(
      "createdBy",
      "name email role"
    );
    if (!member) {
      return res.status(404).json({
        success: false,
        message: `Member with ID ${id} not found.`,
      });
    }

    // Send back the found member as response
    return res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    // Handle any errors (e.g., invalid ID format, database errors)
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error. Please try again later.",
    });
  }
};

exports.deleteMember = async (req, res) => {
  const { id } = req.params; // Get the member ID from the URL

  try {
    // Find the member by ID and remove it
    const member = await NewMember.findByIdAndDelete(id);

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    // Successfully deleted the member
    res
      .status(200)
      .json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting member",
    });
  }
};

exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, phone } = req.body;

  // Normalize role to lowercase to ensure consistency
  const normalizedRole = role ? role.toLowerCase() : null;

  try {
    // Ensure that the role is valid
    const validRoles = ["admin", "member", "guest"];
    if (normalizedRole && !validRoles.includes(normalizedRole)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // Step 1: Update the role in the NewMember collection
    const updatedNewMember = await NewMember.findByIdAndUpdate(
      id,
      { name, email, role: normalizedRole, phone },
      { new: true, runValidators: true } // Return the updated member, and run validation
    );

    if (!updatedNewMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found in NewMember collection",
      });
    }

    // Step 2: Update the role in the User collection
    const updatedUser = await User.findOneAndUpdate(
      { name, email }, // Find the user by name and email
      { role: normalizedRole }, // Update the role
      { new: true, runValidators: true } // Return the updated user
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Successfully updated both member and user roles
    res.status(200).json({
      success: true,
      message: "Member and User role updated successfully",
      updatedNewMember,
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({
      success: false,
      message: "Error updating member and user",
      error: error.message,
    });
  }
};
