const bcrypt = require("bcrypt");
const User = require("../Schema/userModel");
const NewMember = require("../Schema/newMemberSchema");
const Connection = require("../Schema/Connection");
const Webhook = require("../Schema/Webhook");
const Client = require("../Schema/Client");
const axios = require("axios");
const mongoose = require("mongoose");
const logger = require("../logger");

// Get all connections
exports.getAllConnections = async (req, res) => {
  try {
    const connections = await Connection.find();
    logger.info("Fetched all connections successfully");
    res.status(200).json(connections);
  } catch (error) {
    logger.error("Error fetching connections", { error: error.message });
    res.status(500).json({ error: "Error fetching connections" });
  }
};

// Create a new webhook
exports.createWebhook = async (req, res) => {
  const { name, url, apiKey } = req.body;

  if (!name || !url || !apiKey) {
    logger.warn("Missing required fields for webhook creation", {
      fields: { name, url, apiKey },
    });
    return res
      .status(400)
      .json({ error: "Name, URL, and API Key are required" });
  }

  try {
    const newWebhook = new Webhook(req.body);
    const webhookData = await newWebhook.save();

    logger.info("Webhook created successfully", { webhookId: webhookData._id });
    res.status(200).json({
      success: true,
      message: "Webhook added successfully",
      data: webhookData,
    });
  } catch (error) {
    logger.error("Error saving webhook", { error: error.message });
    res
      .status(500)
      .json({ error: "Error saving webhook", details: error.message });
  }
};

// Add a member
exports.addMember = async (req, res) => {
  const { name, email, role, createdBy } = req.body;

  try {
    if (!["admin", "member", "guest"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const superAdmin = await User.findById(createdBy);
    if (superAdmin && superAdmin.name === name && superAdmin.email === email) {
      return res.status(400).json({
        success: false,
        message: "Cannot create a new member with the super admin's name and email.",
      });
    }

    const existingUser = await User.findOne({ name, email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "No account found with this name and email.",
      });
    }

    const existingMember = await NewMember.findOne({ name, email, createdBy });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Member already exists.",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { name, email },
      { role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Error updating user role. User not found.",
      });
    }

    const newMember = new NewMember({
      name,
      email,
      role,
      createdBy,
    });

    await newMember.save();

    return res.status(200).json({
      success: true,
      message: "New member added successfully.",
      newMember,
    });
  } catch (error) {
    logger.error("Error adding new member", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Error adding new member",
    });
  }
};

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const newMembers = await NewMember.find();
    if (newMembers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new members found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "New members fetched successfully",
      newMembers,
    });
  } catch (error) {
    logger.error("Error fetching new members", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Error fetching new members",
    });
  }
};

// Get single member by ID
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

    return res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    logger.error("Error fetching single member", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Server Error. Please try again later.",
    });
  }
};

// Delete a member
exports.deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await NewMember.findByIdAndDelete(id);

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    logger.error("Error deleting member", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Error deleting member",
    });
  }
};

// Update a member
exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, phone } = req.body;

  const normalizedRole = role ? role.toLowerCase() : null;

  try {
    const validRoles = ["admin", "member", "guest"];
    if (normalizedRole && !validRoles.includes(normalizedRole)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const updatedNewMember = await NewMember.findByIdAndUpdate(
      id,
      { name, email, role: normalizedRole, phone },
      { new: true, runValidators: true }
    );

    if (!updatedNewMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found in NewMember collection",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { name, email },
      { role: normalizedRole },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Member and User role updated successfully",
      updatedNewMember,
      updatedUser,
    });
  } catch (error) {
    logger.error("Error updating member", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Error updating member and user",
      error: error.message,
    });
  }
};
