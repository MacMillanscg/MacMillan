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
const fs = require("fs");
const helmet = require("helmet"); // For security headers

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/public", express.static(path.join(__dirname, "public")));
// app.use(express.static("public"));

// MongoDB Connection
const url = process.env.MONGO_URI_PROD;
// const url = process.env.NODE_ENV === "production" ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Error in MongoDB connection:", err);
  });

// Middleware Setup
app.use(cors()); // You can customize CORS if needed for production
app.use(helmet()); // Use helmet to secure HTTP headers
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());

// Routes
const userAuth = require("./routes/auth");
const support = require("./routes/supportRoute");
const clientRoute = require("./routes/clientRoutes");
const connectionRoute = require("./routes/connectionRoutes");
const summaryRoute = require("./routes/summaryRoute");
const exploreRoute = require("./routes/exploreRoute");

app.use("/auth", userAuth);
app.use("/supports", support);
app.use("/clients", clientRoute);
app.use("/connections", connectionRoute);
app.use("/summary", summaryRoute);
app.use("/explore", exploreRoute);

// CORS headers (You can make this more restrictive in production)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Serve static files from React build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  // Serve React app for all routes except for API routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Log reading endpoint
app.get("/", (req, res) => {
  const logFilePath = path.join(__dirname, "./logs/app.log");

  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading log file:", err);
      return res.status(500).json({ error: "Error reading log file" });
    }

    const logs = data
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (parseError) {
          console.error("Error parsing log line:", parseError);
          return null;
        }
      })
      .filter(Boolean);

    res.json(logs);
  });
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start Server
app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});

module.exports = app;
