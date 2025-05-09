const router = require("express").Router();
const bcrypt = require("bcrypt");
let User = require("../Schema/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { route } = require("./usersRoute");
const axios = require("axios");
const Client = require("../Schema/Client");
const multer = require("multer");
const path = require("path");
const authController = require("../Controllers/authController");

router.get("/", authController.getAllUsers);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:id/:token", authController.resetPassword);

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Specify the destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique file name
  },
});

// Initialize multer with storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Err :") + err);
});

// profile details route
router
  .route("/profiledetails")
  .post(upload.single("profileImage"), async (req, res) => {
    try {
      const { userId, name, phone } = req.body;
      console.log("resbody", req.body);

      // Find the user by userId
      const user = await User.findById(userId);
      console.log("userssss", user);
      if (!user) {
        return res
          .status(400)
          .send({ success: false, message: "User not found" });
      }

      // Update user's name and phone number
      user.name = name;
      user.phone = phone;

      // Check if an image file is uploaded
      if (req.file) {
        user.profileImage = req.file.path; // Save the file path to the user's profile
      }

      // Save the updated user
      const updatedUser = await user.save();

      return res.status(200).send({
        success: true,
        message: "User profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      return res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  });

// udpate password route
router.route("/profileResetPass").post(async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    console.log("resqbo", req.body);

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }

    // Check if the current password matches
    const passwordsMatched = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!passwordsMatched) {
      return res
        .status(400)
        .send({ success: false, message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    // // Update the user's password
    user.password = hashPassword;
    await user.save();

    return res
      .status(200)
      .send({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
