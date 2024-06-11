import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faLink,
  faCalendarAlt,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import styles from "./AddConnections.module.css";
import axios from "axios";
import { url } from "../../api";
import { MaskedToken } from "../ClientsCom/ClientDetails/Integrations/MaskedToken";

export const AddConnections = ({ closeModal }) => {
  const { dashboardWidth } = useAppContext();
  const [connectionName, setConnectionName] = useState("");
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState("");
  const [option, setOption] = useState("");
  const [search, setSearch] = useState("");
  const [selectedClientIntegrations, setSelectedClientIntegrations] = useState(
    []
  );
  console.log("selected", selectedClientIntegrations);

  const userId =
    JSON.parse(localStorage.getItem("rememberMeUser"))._id ||
    JSON.parse(sessionStorage.getItem("userRecord"))._id;
  console.log("USERID", userId);

  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        const response = await axios.get(`${url}/clients`);
        const updatedData = response.data;
        const userClients = updatedData.filter(
          (user) => user.userId === userId
        );
        console.log("updated clients", userClients);
        setClients(userClients);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllClients();
  }, [userId]);
  console.log("clients", clients);

  const handleClientChange = (e) => {
    const selectedClient = clients.find(
      (client) => client.clientName === e.target.value
    );
    setClient(e.target.value);
    if (selectedClient) {
      setSelectedClientIntegrations(selectedClient.integrations || []);
    } else {
      setSelectedClientIntegrations([]);
    }
  };

  const handleCreate = () => {
    const selectedClient = clients.find(
      (client) => client.clientName === client
    );
    const dataToStore = {
      connectionName,
      client: selectedClient.clientName,
      integrations: selectedClientIntegrations,
    };
    console.log("Create connection:", dataToStore);
    // onClose();
  };

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.modalBackground}>
        <div className={styles.modalContainer}>
          <div className={styles.modalHeader}>
            <h2>Create New Connections</h2>
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
          </div>
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label htmlFor="connectionName">Connection Name</label>
              <input
                type="text"
                id="connectionName"
                className="form-control"
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="client">Client</label>
              <select
                id="client"
                value={client}
                className="form-select"
                onChange={handleClientChange}
              >
                <option value="">Select Client</option>
                {clients &&
                  clients.map((client, i) => {
                    return (
                      <option value={client.clientName}>
                        {client.clientName}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Select your trigger</label>
              <div className={styles.options}>
                <button
                  className={`${styles.optionButton} ${
                    option === "Webhook" ? styles.active : ""
                  }`}
                  onClick={() => setOption("Webhook")}
                >
                  <FontAwesomeIcon
                    icon={faLink}
                    className={styles.optionIcon}
                  />
                  Webhook
                </button>
                <button
                  className={`${styles.optionButton} ${
                    option === "Schedule" ? styles.active : ""
                  }`}
                  onClick={() => setOption("Schedule")}
                >
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className={styles.optionIcon}
                  />
                  Schedule
                </button>
                <button
                  className={`${styles.optionButton} ${
                    option === "Management" ? styles.active : ""
                  }`}
                  onClick={() => setOption("Management")}
                >
                  <FontAwesomeIcon
                    icon={faCogs}
                    className={styles.optionIcon}
                  />
                  Management
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="search">Search Integrations</label>
              <input
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.integrationList}>
              {selectedClientIntegrations.length === 0 ? (
                <h4 className="my-1">No integrations Available</h4>
              ) : (
                <h4 className="my-1">Available Integrations</h4>
              )}
              <ul className="ps-0">
                {selectedClientIntegrations.map((integration, index) => {
                  return (
                    <>
                      <li key={index} className={styles.integrationItem}>
                        {integration.platform}
                      </li>
                      <li>{integration.integrationName}</li>
                      <li>{integration.storeUrl}</li>
                      <li>
                        <MaskedToken token={integration.apiKey} />
                      </li>
                    </>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            {/* <button className={styles.cancelButton} onClick={closeModal}>
              Cancel
            </button> */}
            <button className={styles.addButton}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
};
