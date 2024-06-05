import React, { useState, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import styles from "./ClientDetail.module.css";
import { DetailsTab } from "./DetailsTab";
import { IntegrationTab } from "./Integrations/IntegrationTab";
import { LogsTab } from "./LogsTab";
import { ConnectionsTab } from "./ConnectionsTab";
import { SummaryTab } from "./SummaryTab";
import { LogsTabHeader } from "./LogsTabHeader";
import { ClientDetailTop } from "./ClientDetailTop";
import { url } from "../../../api";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DetailsTabTop } from "./DetailsTabTop";
import { IntegrationTabHeader } from "./Integrations/IntegrationTabHeader";

export const ClientDetailsTabs = () => {
  const [activeTab, setActiveTab] = useState("Summary");
  const [client, setClient] = useState("");
  const { dashboardWidth } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchClientSingleRecord = async () => {
      try {
        const response = await axios.get(`${url}/clients/${id}`);
        const clientData = response.data;
        setClient(clientData.clientName);
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
          <h2>{client}</h2>
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
            activeTab === "Integration" && styles.active
          }`}
          onClick={() => handleTabClick("Integration")}
        >
          Integrations
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
        {activeTab === "Integration" && (
          <IntegrationTab
            clientId={id}
            openModal={openModal}
            closeModal={closeModal}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        {activeTab === "Logs" && <LogsTab />}
        {activeTab === "Details" && <DetailsTab clientId={id} />}
      </div>
    </div>
  );
};
