import React, { useState, useEffect } from "react";
import { JSONTree } from "react-json-tree";
import axios from "axios";
import { js2xml } from "xml-js";
import toast from "react-hot-toast";
import styles from "./OutputLogs.module.css";
import { url as apiURL } from "../../../../api";

const theme = {
  base00: "#ffffff",
  base01: "#f5f5f5",
  base02: "#e0e0e0",
  base03: "#d5d5d5",
  base04: "#aaaaaa",
  base05: "#333333",
  base06: "#000000",
  base07: "#333333",
  base08: "#d73a49",
  base09: "#d73a49",
  base0A: "#d73a49",
  base0B: "#6f42c1",
  base0C: "#005cc5",
  base0D: "#005cc5",
  base0E: "#6f42c1",
  base0F: "#d73a49",
};

const DataTreeView = ({ data }) => (
  <div style={{ margin: "20px" }}>
    <JSONTree data={data} theme={theme} invertTheme={false} />
  </div>
);

export const OutputLogs = ({ shopifyDetails, id }) => {
  const [activeTab, setActiveTab] = useState("output");
  const [orders, setOrders] = useState([]);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("xml");
  const [folderName, setFolderName] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Fetch the folder name by ID from localStorage
  useEffect(() => {
    const fetchFolderNameById = () => {
      const savedDirectories = localStorage.getItem("savedDirectories");
      if (savedDirectories) {
        try {
          const directories = JSON.parse(savedDirectories);
          const directoryForId = directories.find((dir) => dir.id === id);
          if (directoryForId && directoryForId.name) {
            setFolderName(directoryForId.name);
          } else {
            setFolderName(""); // Clear folder name
            toast.error("No folder found for this connection. Please set it first.");
          }
        } catch (error) {
          console.error("Error parsing saved directories:", error);
          toast.error("Failed to load folder from localStorage.");
        }
      } else {
        setFolderName(""); // Reset folder name
        toast.error("No saved folder found to export orders.");
      }
    };
  
    fetchFolderNameById();
  }, [id]);
  

  // Fetch Shopify Orders
  const fetchShopifyOrders = async () => {
    try {
      const response = await axios.get(`${apiURL}/connections/${id}/api/orders`);
      const orders = response.data.orders;

      const unfulfilledOrders = orders.filter(
        (order) => order.fulfillment_status !== "fulfilled"
      );

      const ordersWithPhone = unfulfilledOrders.map((order) => {
        const phoneNumber = order.customer?.phone || "No phone provided";
        return { ...order, customerPhone: phoneNumber };
      });

      setOrders(ordersWithPhone);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    }
  };

  // Export Orders
  const exportOrders = async () => {
    // if (!orders || orders.length === 0) {
    //   toast.error("No orders available to export.");
    //   return;
    // }
    // const folderName = "Shopify_B2C_Live _Sandbox"

    // if (!folderName) {
    //   toast.error("Folder name is not set for this connection.");
    //   return;
    // }

    // Filter today's orders
    const today = new Date().toISOString().split("T")[0];
    const todaysOrders = orders.filter((order) => {
      const orderDate = new Date(order.created_at).toISOString().split("T")[0];
      return orderDate === today;
    });

    // if (todaysOrders.length === 0) {
    //   toast.error("No orders for today to export.");
    //   return;
    // }

    try {
      if (selectedFormat === "xml") {
        const xmlOrders = todaysOrders.map((order) => {
          const xmlContent = js2xml({ order }, { compact: true, spaces: 4 });
          return {
            fileName: `order_${order.id || Date.now()}.xml`,
            content: xmlContent,
          };
        });

        const response = await axios.post(`${apiURL}/connections/api/export-orders`, {
          folderName,
          xmlOrders,
        });

        toast.success(response.data.message || "Orders exported successfully to backend!");
      } else if (selectedFormat === "csv") {
        const csvContent =
          "id,created_at,customerPhone\n" +
          todaysOrders
            .map((order) => `${order.id},${order.created_at},${order.customerPhone}`)
            .join("\n");

        const response = await axios.post(`${apiURL}/api/export-orders`, {
          folderName,
          csvContent,
        });

        toast.success(response.data.message || "Orders exported successfully to backend!");
      }
    } catch (error) {
      console.error("Error exporting orders:", error);
      toast.error("Failed to export orders to backend.");
    }
  };

  // useEffect(() => {
  //   // Function to run exportOrders every 10 seconds
  //   const interval = setInterval(() => {
  //     exportOrders();
  //   }, 10000); 
  //   return () => clearInterval(interval);
  // }, [orders, folderName, selectedFormat]); 
  

  useEffect(() => {
    fetchShopifyOrders();
  }, []);

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabs}>
        <div className="d-flex">
          <div
            className={`${styles.tab} ${
              activeTab === "output" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("output")}
          >
            Output
          </div>
          <div
            className={`${styles.tab} ${
              activeTab === "logs" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("logs")}
          >
            Logs
          </div>
        </div>
        <div className={styles.exportButtonContainer}>
          <button
            className="btn btn-primary"
            onClick={() => setShowExportOptions(!showExportOptions)}
          >
            Export
          </button>
          {showExportOptions && (
            <div className={styles.exportOptions}>
              <div>
                <input
                  type="radio"
                  id="csv"
                  name="format"
                  value="csv"
                  onChange={() => setSelectedFormat("csv")}
                />
                <label className={styles.label} htmlFor="csv">
                  CSV
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="xml"
                  name="format"
                  value="xml"
                  onChange={() => setSelectedFormat("xml")}
                  defaultChecked
                />
                <label className={styles.label} htmlFor="xml">
                  XML
                </label>
              </div>
              <div className={styles.btns}>
                <button
                  onClick={() => {
                    exportOrders();
                    setShowExportOptions(false);
                  }}
                  className="btn btn-primary mt-2"
                >
                  Export
                </button>
                <button
                  onClick={() => setShowExportOptions(false)}
                  className={`${styles.cancel} btn btn-secondary mt-2`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={`${styles.tabContent} ${styles.outputlog}`}>
        {activeTab === "output" && (
          <div className={styles.output}>
            <h4 className="fs-5 m-0 mb-3">Output</h4>
            {shopifyDetails ? (
              <DataTreeView data={orders} />
            ) : (
              <p>No data available</p>
            )}
          </div>
        )}
        {activeTab === "logs" && (
          <div className={styles.logs}>
            <h4 className="fs-6 m-0 mb-3">Logs</h4>
            <p>No logs exist for this step</p>
          </div>
        )}
      </div>
    </div>
  );
};
