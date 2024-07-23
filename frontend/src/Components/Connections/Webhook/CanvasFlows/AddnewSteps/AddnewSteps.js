import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faLink,
  faCalendarAlt,
  faCogs,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../../../../Context/AppContext";
import styles from "./AddnewSteps.module.css";
import axios from "axios";
import { url } from "../../../../../api";
import { MaskedToken } from "../../../../ClientsCom/ClientDetails/Integrations/MaskedToken";
import {
  webhookTriggers,
  managementTriggers,
  scheduleOptions,
} from "../../WebhookData";
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../../../../../storageUtils/storageUtils";

export const AddnewSteps = ({ closeModal, onclose }) => {
  const { id } = useParams();
  // console.log("sdfasf", id);
  const { dashboardWidth } = useAppContext();
  const [connectionName, setConnectionName] = useState("");
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState("");
  const [option, setOption] = useState("");
  const [search, setSearch] = useState("");
  const [selectedClientIntegrations, setSelectedClientIntegrations] = useState(
    []
  );
  const [cronExpression, setCronExpression] = useState("");
  const [schedule, setSchedule] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [selectedWebhookTrigger, setSelectedWebhookTrigger] = useState(null);
  const [selectedManagementTrigger, setSelectedManagementTrigger] =
    useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const navigate = useNavigate();
  let userId = getUser();
  userId = userId._id;

  // console.log("selectedWebhookTrigger", selectedWebhookTrigger);
  console.log("selectedIntegration", selectedIntegration);

  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        const response = await axios.get(`${url}/clients`);
        const updatedData = response.data;
        const userClients = updatedData.filter(
          (user) => user.userId === userId
        );
        // console.log("updated clients", userClients);
        setClients(userClients);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllClients();
  }, [userId]);
  // console.log("clients", clients);

  const handleClientChange = (e) => {
    const clientName = e.target.value;
    const selectedClient = clients.find(
      (client) => client.clientName === clientName
    );
    setSelectedClient(selectedClient);
    setClient(clientName);
    if (selectedClient) {
      setSelectedClientIntegrations(selectedClient.integrations || []);
    } else {
      setSelectedClientIntegrations([]);
    }
  };
  console.log("selectintegration", selectedClientIntegrations);

  const handleWebhookTriggerClick = (trigger) => {
    setSelectedWebhookTrigger(trigger);
  };

  const handleManagementTriggerClick = (trigger) => {
    setSelectedManagementTrigger(trigger);
  };
  console.log("select client", selectedClient?.clientName);

  const handleIntegrationClick = (integration) => {
    setSelectedIntegration(integration);
  };

  // console.log("client1", client);
  const handleCreate = async () => {
    try {
      const selectedClientObj = clients.find(
        (client) => client.clientName === client
      );

      const formattedIntegrations = {
        integrationId: selectedIntegration?._id,
        integrationName: selectedIntegration?.integrationName,
        platform: selectedIntegration?.platform,
        storeUrl: selectedIntegration?.storeUrl,
        apiKey: selectedIntegration?.apiKey,
      };

      // console.log("selcted", selectedClient);
      const dataToStore = {
        connectionName,
        client: {
          clientId: selectedClient._id,
          clientName: selectedClient.clientName,
        },
        // Send the client ID
        integrations: formattedIntegrations,
        // Send integration IDs
        webhookTrigger: option === "Webhook" ? selectedWebhookTrigger : null,
        managementTrigger:
          option === "Management" ? selectedManagementTrigger : null,
        schedule: option === "Schedule" ? schedule : undefined,
        cronExpression: option === "Schedule" ? cronExpression : undefined,
      };
      console.log("Create connection:", dataToStore);
      // Send dataToStore to the server
      const response = await axios.post(
        `${url}/connections/addConnections`,
        dataToStore
      );
      const newConnectionId = response.data.id;
      navigate(`/connections/${newConnectionId}`);
      // console.log("newconnected", newConnectionId);

      console.log("Server response success:", response.data);
    } catch (error) {
      console.log("Error creating connection:", error);
    }
  };

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.modalBackground}>
        <div className={styles.modalContainer}>
          <div className={styles.modalHeader}>
            <h2>Create New Flow</h2>
            <span className={styles.close} onClick={onclose}>
              &times;
            </span>
          </div>
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label htmlFor="connectionName">Flow Name</label>
              <input
                type="text"
                id="connectionName"
                className="form-control"
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)}
              />
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

            {option === "Webhook" && (
              <div className={styles.webhookForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="webhookSearch">Search triggers</label>
                  <div className={styles.searchContainer}>
                    <input
                      type="text"
                      id="webhookSearch"
                      className={styles.searchInput}
                      placeholder="Search triggers"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.integrationList}>
                  {webhookTriggers
                    .filter((trigger) =>
                      trigger.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((trigger, index) => (
                      <div
                        key={index}
                        className={`${styles.integrationItem} ${
                          selectedWebhookTrigger === trigger
                            ? styles.selected
                            : ""
                        }`}
                        onClick={() => handleWebhookTriggerClick(trigger)}
                      >
                        <div className={styles.integrationHeader}>
                          <FontAwesomeIcon
                            icon={faLink}
                            className={styles.optionIcon}
                          />
                          <div>
                            <div className={styles.integrationName}>
                              {trigger.name}
                            </div>
                            <div className={styles.integrationDescription}>
                              {trigger.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {option === "Management" && (
              <div className={styles.managementForm}>
                <div className={styles.integrationList}>
                  {managementTriggers.map((trigger, index) => (
                    <div
                      key={index}
                      className={`${styles.integrationItem} ${
                        selectedManagementTrigger === trigger
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => handleManagementTriggerClick(trigger)}
                    >
                      <div className={styles.integrationHeader}>
                        <FontAwesomeIcon
                          icon={faCogs}
                          className={styles.optionIcon}
                        />
                        <div>
                          <div className={styles.integrationName}>
                            {trigger.name}
                          </div>
                          <div className={styles.integrationDescription}>
                            {trigger.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {option === "Schedule" && (
              <div className={styles.scheduleForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="scheduleType">Schedule Type</label>
                  <select
                    id="scheduleType"
                    className={styles.select}
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                  >
                    {scheduleOptions.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cronExpression">Cron Expression</label>
                  <input
                    type="text"
                    id="cronExpression"
                    className={styles.input}
                    placeholder="* * * * *"
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                  />
                  <small className={styles.cronHelp}>
                    A cron expression for this config variable. You can use `* *
                    * * *` for every minute, `0 0 * * *` for every day, and `0 *
                    * * WED` for every Wednesday. e.g. `*/20 * * * *`
                  </small>
                </div>
              </div>
            )}
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.addButton} onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
