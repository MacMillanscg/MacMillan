const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 5000;
const path = require("path");

const cookieParser = require("cookie-parser");
// Serve static files from the 'public' directory
app.use("/public", express.static(path.join(__dirname, "public")));
// app.use(express.static("public"));

const url = "mongodb://127.0.0.1:27017/mernapp";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch(() => {
    console.log("errr in connection");
  });

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// const userRouter = require("./routes/usersRoute");
const userAuth = require("./routes/auth");
const support = require("./routes/supportRoute");

// app.use("/users", userRouter);
app.use("/auth", userAuth);
app.use("/supports", support);

app.listen(PORT, () => {
  console.log("server is running on port:" + PORT);
});
