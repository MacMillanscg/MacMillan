import React, { useState } from "react";
// import renderData from "./XMLData/renderXml";
import data from "./XMLData/Data";
import { JSONTree } from "react-json-tree";
import styles from "./OutputLogs.module.css";

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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  console.log("selectedIntegration", selectedIntegration.integrations);

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabs}>
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
      <div className={styles.tabContent}>
        {activeTab === "output" && (
          <div className={styles.output}>
            <h4 className="fs-5 m-0 mb-3">Output</h4>
            {selectedIntegration.integrations &&
            selectedIntegration.integrations[0].integrationName ? (
              <DataTreeView data={data} />
            ) : (
              <p>No Output exist for this step</p>
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
