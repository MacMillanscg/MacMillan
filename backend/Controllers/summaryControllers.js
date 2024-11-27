const axios = require("axios");
const Connection = require("../Schema/Connection");
const fs = require("fs").promises; // Use the promise-based version of fs
const path = require("path");
const xml2js = require("xml2js");
const Shipment = require("../Schema/ShipmentSchema");

exports.verifyEShipperCredential = async (req, res) => {
  const { url, principal, credential } = req.body;
  // console.log(req.body);
  try {
    const response = await axios.post(url, {
      principal,
      credential,
    });
    // console.log(response);

    res.json({ token: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Route to fetch orders from Shopify
exports.shofipyOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    const integration = connection.integrations[0];
    // console.log(integration);
    const { apiKey, storeUrl } = integration;

    const response = await axios.get(
      `https://${storeUrl}/admin/api/2024-04/orders.json`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": apiKey,
        },
      }
    );
    // console.log("resdata", response);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Server Error");
  }
};

const DOWNLOAD_FOLDER = "C:\\Users\\Laptop Valley\\Downloads";

exports.convertXmlFilesToJson = async (req, res) => {
  try {
    // Read all files in the Downloads folder
    const files = await fs.readdir(DOWNLOAD_FOLDER);

    // Filter only XML files
    const xmlFiles = files.filter((file) => file.endsWith(".xml"));

    if (xmlFiles.length === 0) {
      return res.status(404).json({ message: "No XML files found" });
    }

    const parser = new xml2js.Parser();

    // Convert each XML file to JSON
    const jsonDataArray = await Promise.all(
      xmlFiles.map(async (file) => {
        const filePath = path.join(DOWNLOAD_FOLDER, file);
        const xmlData = await fs.readFile(filePath, "utf-8");
        const jsonData = await parser.parseStringPromise(xmlData); // Parse XML to JSON
        return {
          fileName: file,
          data: jsonData,
        };
      })
    );
    // console.log("jsondataarray", jsonDataArray);
    // Return the array of JSON data for all XML files
    res.status(200).json({
      message: "Successfully converted XML files to JSON",
      files: jsonDataArray,
    });
  } catch (error) {
    // Handle errors (file not found, parsing issues, etc.)
    res.status(500).json({
      error: "Failed to convert XML files to JSON",
      details: error.message,
    });
  }
};

// This is the endpoint for the eShipper API

exports.sendDataToEShipper = async (req, res) => {
  try {
    // Extract the JSON data from the request body
    const { extractedData, token } = req.body;
    let successResponses = [];
    let failedResponses = [];

    if (!Array.isArray(extractedData) || extractedData.length === 0) {
      return res.status(400).json({ error: "No shipment data found to send." });
    }
    // console.log("jsonData", extractedData);
    const firstIndexData = extractedData[0];
    // console.log("firstIndexData", firstIndexData);
    console.log(
      "Payload sent to eShipper:",
      JSON.stringify(firstIndexData, null, 2)
    );

    // console.log("token", token);
    const eshipperApiUrl = "https://uu2.eshipper.com/api/v2/ship";

    // Make the PUT request to the eShipper API
    const response = await axios.put(eshipperApiUrl, firstIndexData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("response creating shipment", response.data);

    const shipmentResponseData = response.data;
    const newShipment = new Shipment({
      shipmentId: shipmentResponseData.order.id,
      shopifyOrderId: shipmentResponseData.reference.name,
    });

    // Save the shipment details in the database
    await newShipment.save();
    successResponses.push({
      shipmentId: shipmentResponseData.order.id,
      shopifyOrderId: shipmentResponseData.reference.name,
    });
    // Send the response back to the frontend
    res.status(200).json({
      message: "Data successfully sent to eShipper!",
      eshipperResponse: response.data,
      successResponses: successResponses,
    });
    console.log("response creating shipment", response.data);
  } catch (error) {
    // failedResponses.push({ data, error: error.message });
    console.error(
      "Error sending data to eShipper:",
      error.response?.data || error.response
    );

    // Handle errors and send an appropriate response
    res.status(500).json({
      error: "Failed to send data to eShipper",
      details: error.message,
    });
  }
};

// Controller to fetch shipment and tracking details from eShipper API using shipment ID and shopifyOrderId
exports.getShipmentDetails = async (req, res) => {
  try {
    // Fetch shipment IDs and Shopify order IDs from MongoDB
    const shipments = await Shipment.find({}, "shipmentId shopifyOrderId"); // Fetch both fields
    const shipmentIds = shipments.map((shipment) => shipment.shipmentId);
    const shopifyOrderIds = shipments.map(
      (shipment) => shipment.shopifyOrderId
    ); // Fetch shopifyOrderId

    const eshipperUsername = "Macmillan_sandbox";
    const eshipperPassword = "Macmillan@123";

    // Create the basic auth header
    const authHeader =
      "Basic " +
      Buffer.from(`${eshipperUsername}:${eshipperPassword}`).toString("base64");

    // Iterate over shipment IDs and fetch details from eShipper API
    const shipmentDetails = await Promise.all(
      shipmentIds.map(async (shipmentId, index) => {
        // Fetch shipment details
        const shipmentApiUrl = `https://uu2.eshipper.com/api/v2/ship/${shipmentId}`;
        const shipmentResponse = await axios.get(shipmentApiUrl, {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        });

        // Fetch tracking details
        const trackingApiUrl = `https://uu2.eshipper.com/api/v2/track/${shipmentId}`;
        const trackingResponse = await axios.get(trackingApiUrl, {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        });

        return {
          shipmentId,
          shopifyOrderId: shopifyOrderIds[index], // Include the shopifyOrderId
          shipmentData: shipmentResponse.data,
          trackingData: trackingResponse.data, // Add tracking data
        };
      })
    );
    console.log("shipmentDetails", shipmentDetails);

    // Return the shipment, Shopify order ID, and tracking details in the response
    res.status(200).json({
      message:
        "Shipment, Shopify order ID, and tracking details fetched successfully",
      shipments: shipmentDetails,
    });
  } catch (error) {
    console.error("Error fetching shipment and tracking details:", error);
    res.status(500).json({
      error: "Failed to fetch shipment and tracking details",
      details: error.message,
    });
  }
};

exports.getAllShipmentIds = async (req, res) => {
  try {
    const shipmentsId = await Shipment.find({});
    console.log("All shipment details:", shipmentsId);
    res.status(200).json({ shipmentsId });
  } catch (error) {
    console.error("Error fetching all shipment details:", error);
  }
};
