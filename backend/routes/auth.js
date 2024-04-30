const router = require("express").Router();
const bcrypt = require("bcrypt");
let User = require("../Schema/userModel");
const jwt = require("jsonwebtoken");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Err:" + err));
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
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rafiullah372@gmail.com", // Your Gmail email address
    pass: "kgdgqlaudfbngtjs", // Your Gmail password
  },
});

route.router("/forgetpass").post(async (req, res) => {
  try {
    const { email } = req.body;
    // Check if user with email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User with this email does not exist" });
    }
    // Generate reset token
    const resetToken = jwt.sign({ email }, "SHEY", { expiresIn: "1h" });
    // Save reset token in user document
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    await user.save();
    // Send reset password email
    const resetLink = `http://localhost:3000/resetpassword?token=${resetToken}`;
    await transporter.sendMail({
      from: "rafiullah372@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `Please click <a href="${resetLink}">here</a> to reset your password.`,
    });
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ error: "Password reset failed" });
  }
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
        });
      } else {
        res.status(200).send({ success: false, message: "Incorrect password" });
      }
    } else {
      res
        .status(200)
        .send({ success: false, message: "User does not exist", data: null });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
