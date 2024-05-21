const router = require("express").Router();
const bcrypt = require("bcrypt");
let User = require("../Schema/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { route } = require("./usersRoute");

const multer = require("multer");
const path = require("path");

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

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Err:" + err));
});

router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Err :") + err);
});

// register route
router.route("/register").post(async (req, res) => {
  try {
    // checking for user already exist
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ success: false, message: "User already registered" });
    } else {
      // bcrypt hash password
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      req.body.password = hashPassword;

      const newUser = new User(req.body);
      const result = await newUser.save();
      return res
        .status(200)
        .send({ success: true, message: "User Registered successfully" });
    }
  } catch (error) {
    res.status(400).json("Err" + error);
  }
});

// user login route
router.route("/forgot-password").post((req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User does not exist." });
    }
    const token = jwt.sign({ id: user._id }, "SHEY", {
      expiresIn: 60 * 60,
    });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jkfiverr1@gmail.com",
        pass: "lqwoawlrqxtngdjh",
      },
    });

    var mailOptions = {
      from: "jkfiverr1@gmail.com",
      to: email,
      subject: "Reset Password Link",
      text: `http://localhost:3000/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res
          .status(200)
          .send({ success: true, message: "Please check you email" });
      }
    });
  });
});

router.route("/reset-password/:id/:token").post((req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, "SHEY", (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) =>
              res
                .status(200)
                .send({ success: true, message: "Password updated" })
            )
            .catch((err) => res.send({ Status: err }));
        })
        .catch((err) => res.send({ Status: err }));
    }
  });
});

router.route("/login").post(async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const passwordsMatched = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (passwordsMatched) {
        const dataToBeSentToFrontend = {
          _id: user.id,
          email: user.email,
          name: user.name,
        };
        const token = jwt.sign(dataToBeSentToFrontend, "SHEY", {
          expiresIn: 60 * 60,
        });
        res.status(200).send({
          success: true,
          message: "User login successfully",
          data: token,
          user: dataToBeSentToFrontend,
        });
      } else {
        res.status(200).send({ success: false, message: "Incorrect password" });
      }
    } else {
      res
        .status(400)
        .send({ success: false, message: "User does not exist", data: null });
    }
  } catch (error) {
    res.status(400).send(error);
  }
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
