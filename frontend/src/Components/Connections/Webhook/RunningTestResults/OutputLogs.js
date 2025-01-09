import React, { useState, useEffect, useRef } from "react";
import { JSONTree } from "react-json-tree";
import styles from "./OutputLogs.module.css";
import toast from "react-hot-toast";
import { js2xml } from "xml-js";

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

const DataTreeView = ({ data }) => {
  return (
    <div style={{ margin: "20px" }}>
      <JSONTree data={data} theme={theme} invertTheme={false} />
    </div>
  );
};

export const OutputLogs = ({ selectedIntegration, orders, shopifyDetails }) => {
  const [activeTab, setActiveTab] = useState("output");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("xml");
  const previousOrdersRef = useRef([]);
  const downloadTimerRef = useRef(null); // Timer reference

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  console.log("orders inoutlogs" , orders)

  const flattenObject = (obj, prefix = "") => {
    return Object.keys(obj).reduce((acc, key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        Object.assign(acc, flattenObject(obj[key], fullKey));
      } else {
        if (
          typeof obj[key] === "number" &&
          obj[key] > Number.MAX_SAFE_INTEGER
        ) {
          acc[fullKey] = `"${String(obj[key])}"`;
        } else {
          acc[fullKey] = obj[key];
        }
      }
      return acc;
    }, {});
  };

  const handleExport = (newOrders) => {
    if (!newOrders || newOrders.length === 0) {
      toast.error("No new orders available for export.");
      return;
    }

    // Get stored order IDs from localStorage
    const storedOrderIds =
      JSON.parse(localStorage.getItem("storedOrderIds")) || [];

    const sortedOrders = [...newOrders].sort((a, b) => {
      return String(a.id).localeCompare(String(b.id), undefined, {
        numeric: true,
      });
    });

    sortedOrders.forEach((order) => {
      let content;
      const flattenedOrder = flattenObject(order);

      if (selectedFormat === "csv") {
        const headers = Object.keys(flattenedOrder);
        const rows = headers
          .map((header) => {
            const value =
              flattenedOrder[header] !== undefined
                ? `"${flattenedOrder[header]}"`
                : "";
            return value;
          })
          .join(",");

        content = [headers.join(","), rows].join("\n");
      } else if (selectedFormat === "xml") {
        const wrappedOrder = { order };
        content = js2xml(wrappedOrder, { compact: true, spaces: 4 });
      }

      if (content) {
        const blob = new Blob([content], {
          type: selectedFormat === "csv" ? "text/csv" : "application/xml",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${order.id}.${selectedFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });

    // Update stored order IDs
    const updatedStoredOrderIds = [
      ...new Set([...storedOrderIds, ...sortedOrders.map((order) => order.id)]),
    ];
    localStorage.setItem(
      "storedOrderIds",
      JSON.stringify(updatedStoredOrderIds)
    );

    toast.success(
      `New files downloaded successfully as ${selectedFormat.toUpperCase()}!`
    );
  };

  useEffect(() => {
    // Check if orders have changed and set timer to download new orders
    if (previousOrdersRef.current !== orders && orders.length > 0) {
      const storedOrderIds =
        JSON.parse(localStorage.getItem("storedOrderIds")) || [];
      const newOrders = orders.filter(
        (order) => !storedOrderIds.includes(order.id)
      );
      console.log("new orders" , newOrders)

      if (newOrders.length > 0) {
        // Set a timer to download new orders after 10 seconds
        downloadTimerRef.current = setTimeout(() => {
          handleExport(newOrders);
        }, 500000); // 10000 milliseconds = 10 seconds
      }
    }

    // Cleanup function to clear the timer if component unmounts
    return () => clearTimeout(downloadTimerRef.current);
  }, [orders]);

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
            className={styles.exportButton}
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
                    if (selectedFormat) {
                      handleExport(orders); // Export current orders when clicked
                    } else {
                      toast.error("Please select a format.");
                    }
                  }}
                  className={`btn btn-primary mt-2 ${styles.export}`}
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
