require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const helmet = require("helmet");

const app = express();

// MongoDB Connection
const url = process.env.MONGO_URI_PROD;

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
app.use(cors());
app.use(helmet());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());

// Serve static files from React build (only in production)
// Serve static files from React build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));
  
  // Serve React app for all routes except for API routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });
}


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

// CORS headers for production
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

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
app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port: " + (process.env.PORT || 5000));
});

module.exports = app;
