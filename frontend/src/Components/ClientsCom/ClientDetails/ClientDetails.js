import React, { useState, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import styles from "./ClientDetail.module.css";
import { DetailsTab } from "./DetailsTab";
import { ExecutionsTab } from "./ExecutionsTab";
import { LogsTab } from "./LogsTab";
import { ConnectionsTab } from "./ConnectionsTab";
import { SummaryTab } from "./SummaryTab";
import { LogsTabHeader } from "./LogsTabHeader";
import { ClientDetailTop } from "./ClientDetailTop";
import { url } from "../../../api";
import { useParams } from "react-router-dom";
import axios from "axios";

export const ClientDetails = () => {
  const [activeTab, setActiveTab] = useState("Summary");
  const [client, setClient] = useState("");
  const { dashboardWidth } = useAppContext();
  const { id } = useParams();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    const fetchClientSingleRecord = async () => {
      try {
        const response = await axios.get(`${url}/clients/${id}`);
        console.log("resawse", response.data);
        setClient(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClientSingleRecord();
  }, []);

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className="topheader">
        <ClientDetailTop />
      </div>
      <div className={styles.tabsHeaderSection}>
        <div className={styles.leftTabSection}>
          <h2>{client.clientName}</h2>
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
