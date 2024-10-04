import React, { useState } from "react";
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
  const [selectedFormat, setSelectedFormat] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const flattenObject = (obj, prefix = "") => {
    return Object.keys(obj).reduce((acc, key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        Object.assign(acc, flattenObject(obj[key], fullKey));
      } else {
        acc[fullKey] = obj[key];
      }
      return acc;
    }, {});
  };

  const handleExport = () => {
    if (!orders || orders.length === 0) {
      toast.error("No orders available for export.");
      return;
    }

    // Sort orders in ascending order based on `order.id`
    const sortedOrders = [...orders].sort((a, b) => {
      return String(a.id).localeCompare(String(b.id), undefined, {
        numeric: true,
      });
    });

    sortedOrders.forEach((order) => {
      let content;
      const flattenedOrder = flattenObject(order);

      if (selectedFormat === "csv") {
        // Convert each order to CSV
        const headers = Object.keys(flattenedOrder);

        // Join headers with commas
        const rows = headers
          .map((header) => {
            const value =
              flattenedOrder[header] !== undefined
                ? `"${flattenedOrder[header]}"`
                : "";
            return value;
          })
          .join(","); // Join values with commas

        // Prepare CSV content
        content = [headers.join(","), rows].join("\n");
      } else if (selectedFormat === "xml") {
        // Convert each order to XML
        const wrappedOrder = { order };
        content = js2xml(wrappedOrder, { compact: true, spaces: 4 });
      }

      // Proceed with file download
      if (content) {
        const blob = new Blob([content], {
          type: selectedFormat === "csv" ? "text/csv" : "application/xml",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        // The download name is the order ID followed by the selected format
        a.download = `${order.id}.${selectedFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });

    toast.success(
      `Files downloaded successfully as ${selectedFormat.toUpperCase()}!`
    );
  };

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
                />
                <label className={styles.label} htmlFor="xml">
                  XML
                </label>
              </div>

              <div className={styles.btns}>
                <button
                  onClick={() => {
                    if (selectedFormat) {
                      handleExport();
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
