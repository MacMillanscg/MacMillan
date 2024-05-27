import React, { useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import styles from "./ClientDetail.module.css";
import { DetailsTab } from "./DetailsTab";
import { ExecutionsTab } from "./ExecutionsTab";
import { LogsTab } from "./LogsTab";
import { ConnectionsTab } from "./ConnectionsTab";
import { SummaryTab } from "./SummaryTab";
import { LogsTabHeader } from "./LogsTabHeader";
import { ClientDetailTop } from "./ClientDetailTop";

export const ClientDetails = () => {
  const [activeTab, setActiveTab] = useState("Summary");
  const { dashboardWidth } = useAppContext();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className="topheader">
        <ClientDetailTop />
      </div>
      <div className={styles.tabsHeaderSection}>
        <div className={styles.leftTabSection}>
          <h2>Test</h2>
        </div>
        <div className={styles.rightSection}>
          {activeTab === "Logs" && <LogsTabHeader />}
        </div>
      </div>
      <div className={styles.tabContainer}>
        <div
          className={`${styles.tab} ${
            activeTab === "Summary" && styles.active
          }`}
          onClick={() => handleTabClick("Summary")}
        >
          Summary
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "Connections" && styles.active
          }`}
          onClick={() => handleTabClick("Connections")}
        >
          Connections
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "Executions" && styles.active
          }`}
          onClick={() => handleTabClick("Executions")}
        >
          Executions
        </div>
        <div
          className={`${styles.tab} ${activeTab === "Logs" && styles.active}`}
          onClick={() => handleTabClick("Logs")}
        >
          Logs
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "Details" && styles.active
          }`}
          onClick={() => handleTabClick("Details")}
        >
          Details
        </div>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "Summary" && <SummaryTab />}
        {activeTab === "Connections" && <ConnectionsTab />}
        {activeTab === "Executions" && <ExecutionsTab />}
        {activeTab === "Logs" && <LogsTab />}
        {activeTab === "Details" && <DetailsTab />}
      </div>
    </div>
  );
};
