const router = require("express").Router();
const nodemailer = require("nodemailer");

router.route("/support").post((req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "jkfiverr1@gmail.com",
      pass: "lqwoawlrqxtngdjh",
    },
  });

  const mailOptions = {
    from: "jkfiverr1@gmail.com",
    to: "support@macmillanscg.com",
    subject: "New Support Request",
    html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send("Error sending email");
    } else {
      res.status(200).send("Email sent successfully");
    }
  });
});

module.exports = router;
