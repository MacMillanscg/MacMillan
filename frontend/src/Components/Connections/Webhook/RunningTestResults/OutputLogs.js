import React, { useState } from "react";
import data from "./XMLData/Data";
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

export const OutputLogs = ({ selectedIntegration }) => {
  const [activeTab, setActiveTab] = useState("output");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleExport = (format) => {
    let content;
    if (format === "csv") {
      // Convert JSON data to CSV
      const headers = Object.keys(data[0]);
      const rows = data.map((row) =>
        headers.map((header) => row[header]).join(",")
      );
      content = [headers.join(","), ...rows].join("\n");
    } else if (format === "xml") {
      // Convert JSON data to XML
      content = js2xml(data, { compact: true, spaces: 4 });
    }

    const blob = new Blob([content], {
      type: format === "csv" ? "text/csv" : "application/xml",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || `exported_data.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`File downloaded successfully as ${format.toUpperCase()}!`);
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
                  onChange={() => handleExport("csv")}
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
                  onChange={() => handleExport("xml")}
                />
                <label className={styles.label} htmlFor="xml">
                  XML
                </label>
              </div>

              <div className={styles.btns}>
                <button
                  onClick={() => {
                    if (fileName) {
                      handleExport("csv");
                    } else {
                      toast.error("Please enter a file name.");
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
            {selectedIntegration.integrations &&
            selectedIntegration.integrations[0].integrationName ? (
              <DataTreeView data={data} />
            ) : (
              <p>No Output exists for this step</p>
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
