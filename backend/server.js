require("dotenv").config();

const express = require("express");
// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("./swagger-output.json");

const app = express();
const axios = require("axios");

const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const path = require("path");
const cookieParser = require("cookie-parser");

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/public", express.static(path.join(__dirname, "public")));
// app.use(express.static("public"));

// const url = "mongodb://127.0.0.1:27017/mernapp";
const url = process.env.MONGO_URI;

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
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());

const userAuth = require("./routes/auth");
const support = require("./routes/supportRoute");
const clientRoute = require("./routes/clientRoutes");
const connectionRoute = require("./routes/connectionRoutes");
const summaryRoute = require("./routes/summaryRoute");
// app.use("/users", userRouter);
app.use("/auth", userAuth);
app.use("/supports", support);
app.use("/clients", clientRoute);
app.use("/connections", connectionRoute);
app.use("/summary", summaryRoute);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.listen(PORT, () => {
  console.log("server is running on port:" + PORT);
});
module.exports = app;
