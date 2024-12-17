const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../Schema/userModel");
const logger = require("../logger");

exports.getAllUsers = (req, res) => {
  User.find()
    .then((users) => {
      logger.info("Fetched all users successfully", {
        count: users.length,
        users: users, // Optionally include user data (be cautious with sensitive information)
      });
      res.json(users);
    })
    .catch((err) => {
      logger.error("Error fetching users", {
        message: err.message,
        stack: err.stack, // Optionally log the stack trace for debugging
      });
      res.status(500).json({ error: "Error fetching users" });
    });
};

// Register User
exports.register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      logger.warn("Registration attempt with existing email", {
        email: req.body.email,
      });
      return res
        .status(200)
        .send({ success: false, message: "User already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    const newUser = new User(req.body);
    await newUser.save();

    logger.info("User registered successfully", { email: req.body.email });
    res
      .status(200)
      .send({ success: true, message: "User Registered successfully" });
  } catch (error) {
    logger.error("Error registering user", {
      message: error.message,
      stack: error.stack, // Optionally log the stack trace for debugging
    });
    res.status(400).json("Err" + error);
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const passwordsMatched = await bcrypt.compare(
        req.body.password,
        user.password
      );
      console.log("users", user);
      if (passwordsMatched) {
        const dataToBeSentToFrontend = {
          _id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
        const token = jwt.sign(dataToBeSentToFrontend, "SHEY", {
          expiresIn: 60 * 60,
        });

        logger.info("User logged in successfully", { email: user.email });

        res.status(200).send({
          success: true,
          message: "User login successfully",
          data: token,
          user: dataToBeSentToFrontend,
        });
      } else {
        logger.warn("Incorrect password attempt", { email: req.body.email });
        res.status(200).send({ success: false, message: "Incorrect password" });
      }
    } else {
      logger.warn("Login attempt for non-existent user", {
        email: req.body.email,
      });
      res
        .status(400)
        .send({ success: false, message: "User does not exist", data: null });
    }
  } catch (error) {
    logger.error("Error during login", {
      message: error.message,
      stack: error.stack, // Optionally log the stack trace for debugging
    });
    res.status(400).send(error);
  }
};

// user login route
exports.forgotPassword = (req, res) => {
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
};

exports.resetPassword = (req, res) => {
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
};
