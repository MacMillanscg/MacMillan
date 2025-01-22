const axios = require("axios");
const Connection = require("../Schema/Connection");
const fs = require("fs").promises; // Use the promise-based version of fs
const path = require("path");
const xml2js = require("xml2js");
const Shipment = require("../Schema/ShipmentSchema");
const os = require("os");
const { shofipyOrders } = require("./connectionController");

// Verify eShipper Credentials
exports.verifyEShipperCredential = async (req, res) => {
  const { url, principal, credential } = req.body;
  try {
    const response = await axios.post(url, { principal, credential });
    res.json({ token: response.data });
  } catch (error) {
    console.error("Error verifying eShipper credentials:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};


// Fetch orders from all Shopify stores
exports.shofipyOrders = async (req, res) => {
  try {
    // Get all connections from the database
    const connections = await Connection.find();
    // console.log("connections", connections);

    if (!connections || connections.length === 0) {
      return res.status(404).json({ message: "No connections found" });
    }

    const allOrders = []; // To store all orders with client details
    const orderSummary = []; // To store only orderId and clientId

    // Loop through each connection
    for (const connection of connections) {
      const clientId = connection.client?.clientId || "Unknown Client ID";
      const clientName = connection.client?.clientName || "Unknown Client";

      for (const integration of connection.integrations) {
        const { apiKey, storeUrl } = integration;

        try {
          // Fetch orders from the Shopify store
          const response = await axios.get(
            `https://${storeUrl}/admin/api/2024-04/orders.json`,
            {
              headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": apiKey,
              },
            }
          );

          // Process all orders
          const enrichedOrders = response.data.orders.map((order) => {
            // Add to order summary (only orderId and clientId)
            orderSummary.push({
              orderId: order.id,
              clientId,
              clientName
            });

            // Add to all orders with client details
            return {
              ...order, // Include full original order details
              clientId,
              clientName,
            };
          });

          // Add enriched orders to the total orders list
          allOrders.push(...enrichedOrders);
        } catch (error) {
          console.error(
            `Error fetching orders from store: ${storeUrl}`,
            error.message
          );
        }
      }
    }

    // Return all orders and the order summary
    res.json({
      orders: allOrders, // Full enriched orders
      orderSummary, // Only orderId and clientId
    });
  } catch (error) {
    console.error("Error fetching all Shopify orders:", error);
    res.status(500).send("Server Error");
  }
};



// Convert XML files to JSON
exports.convertXmlFilesToJson = async (req, res) => {
  try {
    
    // const NETWORK_PATH = "\\\\DESKTOP-22QU5F1\\ShopifyOrders\\ACK_folder";
    const NETWORK_PATH = "\\\\vm-mac-fs01\\Shared\\Interface\\Shopify\\ACK_eShipper";
    const files = await fs.readdir(NETWORK_PATH);
    console.log("files", files);

    const xmlFiles = files.filter((file) => file.endsWith(".xml"));
    console.log("XMLFILES", xmlFiles);

    if (xmlFiles.length === 0) {
      return res.status(404).json({ message: "No XML files found" });
    }

    const parser = new xml2js.Parser();

    const jsonDataArray = await Promise.all(
      xmlFiles.map(async (file) => {
        const filePath = path.join(NETWORK_PATH, file);
        const xmlData = await fs.readFile(filePath, "utf-8");
        const jsonData = await parser.parseStringPromise(xmlData);
        return { fileName: file, data: jsonData };
      })
    );

    res.status(200).json({
      message: "Successfully converted XML files to JSON",
      files: jsonDataArray,
    });
  } catch (error) {
    console.error("Error converting XML files to JSON:", error);
    res.status(500).json({
      error: "Failed to convert XML files to JSON",
      details: error.message,
    });
  }
};


// Send Data to eShipper
exports.sendDataToEShipper = async (req, res) => {
  try {
    const { extractedData, token } = req.body;

    if (!Array.isArray(extractedData) || extractedData.length === 0) {
      return res.status(400).json({ error: "No shipment data found to send." });
    }

    const firstIndexData = extractedData[0];
    console.log("Payload sent to eShipper:", JSON.stringify(firstIndexData, null, 2));

    const eshipperApiUrl = "https://ww2.eshipper.com/api/v2/ship";

    const response = await axios.put(eshipperApiUrl, firstIndexData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const shipmentResponseData = response.data;

    const newShipment = new Shipment({
      shipmentId: shipmentResponseData.order.id,
      shopifyOrderId: shipmentResponseData.reference.name,
      scheduledShipDate: firstIndexData.scheduledShipDate,
      from: firstIndexData.from,
      // to: firstIndexData.to,
      packagingUnit: firstIndexData.packagingUnit,
      packages: firstIndexData.packages,
      reference1: firstIndexData.reference1,
      reference2: firstIndexData.reference2,
      reference3: firstIndexData.reference3,
      // signatureRequired: firstIndexData.signatureRequired,
      // insuranceType: firstIndexData.insuranceType,
      pickup: firstIndexData.pickup,
    });

    console.log("New Shipment:", newShipment);

    await newShipment.save();

    res.status(200).json({
      message: "Data successfully sent to eShipper!",
      eshipperResponse: response.data,
      successResponses: newShipment,
    });
  } catch (error) {
    console.error("Error sending data to eShipper:", error.response?.data || error);
    res.status(500).json({
      error: "Failed to send data to eShipper",
      details: error.message,
    });
  }
};


// Get Shipment Details
exports.getShipmentDetails = async (req, res) => {
  try {
    const shipments = await Shipment.find({}, "shipmentId shopifyOrderId");
    const shipmentIds = shipments.map((shipment) => shipment.shipmentId);
    console.log("SHIpmendtIDs" , shipmentIds)
    const shopifyOrderIds = shipments.map((shipment) => shipment.shopifyOrderId);

    const eshipperUsername = "macmillan";
    const eshipperPassword = "Apple@2024";

    const authHeader =
      "Basic " +
      Buffer.from(`${eshipperUsername}:${eshipperPassword}`).toString("base64");

    const shipmentDetails = await Promise.all(
      shipmentIds.map(async (shipmentId, index) => {
        const shipmentApiUrl = `https://ww2.eshipper.com/api/v2/ship/${shipmentId}`;
        const shipmentResponse = await axios.get(shipmentApiUrl, {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        });

        const trackingApiUrl = `https://ww2.eshipper.com/api/v2/track/${shipmentId}`;
        const trackingResponse = await axios.get(trackingApiUrl, {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        });

        return {
          shipmentId,
          shopifyOrderId: shopifyOrderIds[index],
          shipmentData: shipmentResponse.data,
          trackingData: trackingResponse.data,
        };
      })
    );

    res.status(200).json({
      message: "Shipment and tracking details fetched successfully",
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

// Get All Shipment IDs
exports.getAllShipmentIds = async (req, res) => {
  try {
    const shipmentsId = await Shipment.find({});
    res.status(200).json({ shipmentsId });
  } catch (error) {
    console.error("Error fetching all shipment details:", error);
    res.status(500).json({ error: "Failed to fetch shipment details" });
  }
};


// Get all shipments
exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.status(200).json(shipments);
  } catch (error) {
    console.error("Error fetching shipments:", error.message);
    res.status(500).json({ message: "Failed to fetch shipments", error: error.message });
  }
};