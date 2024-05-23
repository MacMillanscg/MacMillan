const express = require("express");
const app = express();
const axios = require("axios");

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

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

// app.get("/shopify", async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://27cd06-29.myshopify.com/admin/api/2024-04/shop.json",
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-Shopify-Access-Token": "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",
//         },
//       }
//     );
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

app.listen(PORT, () => {
  console.log("server is running on port:" + PORT);
});
