const axios = require("axios");
const Connection = require("../Schema/Connection");
const fs = require("fs").promises; // Use the promise-based version of fs
const path = require("path");
const xml2js = require("xml2js");
const Shipment = require("../Schema/ShipmentSchema");
const os = require("os");
const moment = require("moment"); 
const Order = require("../Schema/ShopifyOrderSchema");
require("dotenv").config();

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

        // console.log("integrations" , integration)

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
// console.log("all orders" , allOrders)
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
    
    // For my path just for testinng
    // const NETWORK_PATH = "\\\\DESKTOP-22QU5F1\\ShopifyOrders\\ACK_folder";
    // FOr client path
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

    // const eshipperApiUrl = "https://ww2.eshipper.com/api/v2/ship";
    const eshipperApiUrl = process.env.ESHIPPER_URL_SHIPMENT;

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
      to: firstIndexData.to,
      packagingUnit: firstIndexData.packagingUnit,
      packages: firstIndexData.packages,
      reference1: firstIndexData.reference1,
      reference2: firstIndexData.reference2,
      reference3: firstIndexData.reference3,
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
    const shopifyOrderIds = shipments.map((shipment) => shipment.shopifyOrderId);
    console.log("shopifyOrderIds", shopifyOrderIds);

    console.log("Shipment IDs:", shipmentIds);

    const eshipperUsername = process.env.ESHIPPER_USERNAME;
    const eshipperPassword = process.env.ESHIPPER_PASSWORD;

    const authHeader =
      "Basic " +
      Buffer.from(`${eshipperUsername}:${eshipperPassword}`).toString("base64");

    const shipmentDetails = await Promise.all(
      shipmentIds.map(async (shipmentId, index) => {
        if (!shipmentId) {
          console.warn(`Invalid shipmentId: ${shipmentId}`);
          return null; // Skip invalid shipment IDs
        }

        try {
          const shipmentApiUrl = `${process.env.SHIPMENT_API_URL}${shipmentId}`;
          const trackingApiUrl = `${process.env.TRACKING_API_URL}${shipmentId}`;

          console.log("Fetching shipment details from:", shipmentApiUrl);

          const shipmentResponse = await axios.get(shipmentApiUrl, {
            headers: {
              Authorization: authHeader,
              "Content-Type": "application/json",
            },
          });

          console.log("shipmentResponse", shipmentResponse.data);

          console.log("Fetching tracking details from:", trackingApiUrl);

          const trackingResponse = await axios.get(trackingApiUrl, {
            headers: {
              Authorization: authHeader,
              "Content-Type": "application/json",
            },
          });

          // Check if the reference name exists in the shopifyOrderIds array
          const referenceName = shipmentResponse.data.reference?.name; // Extract reference name
          const trackingNumber = shipmentResponse.data.trackingNumber;
          const trackingUrl = shipmentResponse.data.trackingUrl;
          const data = shipmentResponse.data.labelData.label[0].data

          if (shopifyOrderIds.includes(referenceName)) {
            // If the reference name exists in shopifyOrderIds, save tracking data
            const updatedShipment = await Shipment.findOneAndUpdate(
              { shipmentId }, // Find the shipment by its shipmentId
              { 
                trackingNumber,  // Update the tracking number
                trackingUrl ,     // Update the tracking URL
                labelData: Buffer.from(data),
              },
              { new: true }  // Return the updated document
            );

            return {
              shipmentId,
              shopifyOrderId: shopifyOrderIds[index],
              shipmentData: shipmentResponse.data,
              trackingData: trackingResponse.data,
              updatedShipment,  // Return the updated shipment data
            };
          } else {
            console.warn(`Reference name ${referenceName} does not match any Shopify Order IDs.`);
            return null; // Skip this shipment if the reference does not match
          }
        } catch (error) {
          console.warn(
            `Failed to fetch details for shipmentId ${shipmentId}:`,
            error.response?.data || error.message
          );
          return null; // Skip this shipment if it fails
        }
      })
    );

    // Filter out any null entries caused by errors or non-matching reference names
    const validShipments = shipmentDetails.filter((details) => details !== null);

    res.status(200).json({
      message: "Shipment and tracking details fetched successfully",
      shipments: validShipments,
    });
  } catch (error) {
    console.error("Error fetching shipment and tracking details:", error.message);
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

// Get Unfulfilled Orders (need this one )
exports.getUnFullFillment = async (req, res) => {
  try {
    const connections = await Connection.find(); // Get all connections

    if (!connections || connections.length === 0) {
      return res.status(404).json({ message: "No connections found" });
    }

    let allFulfillmentOrders = []; // Array to store all fulfillment order objects

    // Set the date for January 1, 2025
    const startDate = moment("2025-01-01T00:00:00-05:00").toISOString(); 

    // Iterate through each connection
    for (const connection of connections) {
      const integration = connection.integrations[0]; // Assuming each connection has 1 integration
      const { apiKey, storeUrl } = integration;

      try {
        // Fetch orders created on or after January 1, 2025
        const responseId = await axios.get(
          `https://${storeUrl}/admin/api/2024-04/orders.json?created_at_min=${startDate}`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": apiKey,
            },
          }
        );

        const orders = responseId.data.orders.filter(order => order.fulfillment_status == null || order.fulfillments.length === 0);
        const allOrders = responseId.data.orders;
        console.log("allorders", allOrders);

        if (!orders || orders.length === 0) {
          console.log(`No recent orders found for connection with store URL: ${storeUrl}`);
          continue; // Skip to the next connection if no recent orders found
        }

        const orderIds = orders.map((order) => order.id);

        // Iterate through each order to fetch fulfillment orders
        for (const orderId of orderIds) {
          try {
            const response = await axios.get(
              `https://${storeUrl}/admin/api/2024-07/orders/${orderId}/fulfillment_orders.json`,
              {
                headers: {
                  "Content-Type": "application/json",
                  "X-Shopify-Access-Token": apiKey,
                },
              }
            );

            const fulfillmentOrders = response.data.fulfillment_orders;
            // Filter fulfillment orders created on or after January 1, 2025
            const recentFulfillmentOrders = fulfillmentOrders.filter((order) =>
              moment(order.created_at).isSameOrAfter(startDate)
            );

            // Add full fulfillment order objects to the final list
            allFulfillmentOrders.push(...recentFulfillmentOrders);
          } catch (error) {
            console.error(`Error fetching fulfillment for order ${orderId} from ${storeUrl}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error fetching orders from store ${storeUrl}:`, error);
      }
    }

    // Return the collected fulfillment order objects
    res.status(200).json({ fulfillmentOrders: allFulfillmentOrders });
  } catch (error) {
    console.error("Error fetching fulfillment details:", error);
    res.status(500).json({ error: "Failed to fetch fulfillment details" });
  }
};



// to create fulfillment form unfulfill
// Create Fulfillment


exports.createFulfillment = async (req, res) => {
  const { fulfillment_order_id, message, tracking_info } = req.body;

  // Validate the request body
  if (!fulfillment_order_id) {
    return res.status(400).json({ error: "Fulfillment order ID is required" });
  }

  try {
    const connections = await Connection.find(); // Fetch all connections
    if (!connections || connections.length === 0) {
      console.log("No connections found");
      return res.status(404).json({ message: "No connections found" });
    }

    let fulfillmentResponses = []; // To store responses for all connections

    // Iterate through each connection to process the fulfillment
    for (const connection of connections) {
      const integration = connection.integrations[0]; // Assuming each connection has one integration
      const { apiKey, storeUrl } = integration;

      // Prepare the request body
      const requestBody = {
        fulfillment: {
          message: message || "The package was shipped this morning.",
          notify_customer: false,
          tracking_info: tracking_info || {
            number: tracking_info.trackingNumber,
            url: tracking_info.trackingUrl,
          },
          line_items_by_fulfillment_order: [
            {
              fulfillment_order_id: fulfillment_order_id,
            },
          ],
        },
      };

      try {
        // Make the API request to Shopify
        const response = await axios.post(
          `https://${storeUrl}/admin/api/2024-04/fulfillments.json`,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
              // "X-Shopify-Access-Token": apiKey, // Ensure the API key is included
            },
          }
        );

        // Push the successful response
        fulfillmentResponses.push({
          storeUrl,
          status: "success",
          fulfillmentResponse: response.data,
        });

        console.log(`Fulfillment created successfully for store: ${storeUrl}`);
      } catch (error) {
        console.error(`Error creating fulfillment for store ${storeUrl}:`, error);

        // Push the error response
        fulfillmentResponses.push({
          storeUrl,
          status: "error",
          error: error.response ? error.response.data : error.message,
        });
      }
    }

    // Separate successful and failed responses for better clarity
    const successResponses = fulfillmentResponses.filter((r) => r.status === "success");
    const errorResponses = fulfillmentResponses.filter((r) => r.status === "error");

    // Return the responses
    res.status(200).json({
      message: "Fulfillment process completed",
      successCount: successResponses.length,
      errorCount: errorResponses.length,
      successResponses,
      errorResponses,
    });
  } catch (error) {
    console.error("Error creating fulfillment:", error);
    res.status(500).json({ error: "Failed to create fulfillment" });
  }
};

// For future changes (Didn't use until)
exports.sendDataToEShipperForFuture = async (req, res) => {
  try {
    const { extractedData, token } = req.body;

    if (!Array.isArray(extractedData) || extractedData.length === 0) {
      return res.status(400).json({ error: "No shipment data found to send." });
    }

    const eshipperApiUrl = process.env.SHIPMENT_API_URL;
    const successResponses = [];
    const failedResponses = [];

    for (const shipmentData of extractedData) {
      try {
        console.log("Payload sent to eShipper:", JSON.stringify(shipmentData, null, 2));

        const response = await axios.put(eshipperApiUrl, shipmentData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const shipmentResponseData = response.data;

        // Create and save the shipment in MongoDB
        const newShipment = new Shipment({
          shipmentId: shipmentResponseData.order.id,
          shopifyOrderId: shipmentResponseData.reference.name,
          scheduledShipDate: shipmentData.scheduledShipDate,
          from: shipmentData.from,
          to: shipmentData.to,
          packagingUnit: shipmentData.packagingUnit,
          packages: shipmentData.packages,
          reference1: shipmentData.reference1,
          reference2: shipmentData.reference2,
          reference3: shipmentData.reference3,
          pickup: shipmentData.pickup,
        });

        await newShipment.save();

        // Push successful response to array
        successResponses.push({ shipmentId: newShipment.shipmentId, response: shipmentResponseData });
      } catch (error) {
        console.error("Error sending data to eShipper:", error.response?.data || error);
        failedResponses.push({ shipmentData, error: error.message });
      }
    }

    res.status(200).json({
      message: "Data successfully sent to eShipper!",
      successResponses,
      failedResponses,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({
      error: "Failed to send data to eShipper",
      details: error.message,
    });
  }
};

// store latest orders id in database
exports.createShopifyOrdersId = async (req, res) => {
  try {
    const { combinedOrderData } = req.body; 
    console.log("Received Order Data:", combinedOrderData);

    if (!Array.isArray(combinedOrderData) || combinedOrderData.length === 0) {
      return res.status(400).json({ message: "Invalid or empty order data" });
    }
    const bulkOperations = combinedOrderData.map((order) => ({
      updateOne: {
        filter: { shopifyId: order.orderId }, 
        update: {
          $set: {
            shopifyId: order.orderId,
            customer: order.customer || "Unknown",
            address: order.address || "No address",
            platform: order.platform || "Shopify",
            createdDate: new Date(order.createdDate), 
            clientName: order.clientName,
          },
        },
        upsert: true,
      },
    }));

    // Execute bulk operation
    await Order.bulkWrite(bulkOperations);

    res.status(200).json({ message: "Orders saved successfully" });
  } catch (error) {
    console.error("Error saving orders:", error);
    res.status(500).json({ message: "Error saving orders", error });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};