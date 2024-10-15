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
import {
  webhookTriggers,
  managementTriggers,
  scheduleOptions,
} from "../../WebhookData";
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../../../../../storageUtils/storageUtils";

export const AddnewSteps = ({ onclose, onStepCreated, oncloseMenu }) => {
  const { id } = useParams();
  console.log("sdfasf", id);
  const { dashboardWidth } = useAppContext();
  const [connectionName, setConnectionName] = useState("");
  const [clients, setClients] = useState([]);

  const [option, setOption] = useState("");
  const [search, setSearch] = useState("");
  const [cronExpression, setCronExpression] = useState("");
  const [schedule, setSchedule] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [selectedWebhookTrigger, setSelectedWebhookTrigger] = useState(null);
  const [selectedManagementTrigger, setSelectedManagementTrigger] =
    useState(null);
  const navigate = useNavigate();
  let userId = getUser();
  userId = userId._id;
  console.log("schedule", schedule);
  console.log("cronExpression", cronExpression);

  const handleWebhookTriggerClick = (trigger) => {
    setSelectedWebhookTrigger(trigger);
  };

  const handleManagementTriggerClick = (trigger) => {
    setSelectedManagementTrigger(trigger);
  };

  const handleCreate = async () => {
    try {
      const dataToStore = {
        connectionId: id,
        connectionName: connectionName,
        webhookTrigger: option === "Webhook" ? selectedWebhookTrigger : null,
        managementTrigger:
          option === "Management" ? selectedManagementTrigger : null,
        scheduleDetails:
          option === "Schedule" ? { schedule, cronExpression, option } : null,
        shopifyDetails: {
          shopifyTitle: "Shopify",
          shopifyDetails: "Get orders",
        },
        // option: option === "Schedule" ? "Schedule" : null,
      };
      console.log("Create connection:", dataToStore);
      // Send dataToStore to the server
      const response = await axios.post(
        `${url}/connections/addNewsteps/${id}`,
        dataToStore
      );
      const connectionRule = response.data.connectionRule;

      if (Array.isArray(connectionRule) && connectionRule.length > 0) {
        const lastRule = connectionRule[connectionRule.length - 1];
        console.log("Last created rule:", lastRule);

        // Pass the last rule to the parent or do any further processing
        onStepCreated(lastRule);
      }
      onclose();
      oncloseMenu();

      console.log("Server response success:", response.data);
    } catch (error) {
      console.log("Error creating connection:", error);
    }
  };

  console.log("option", option);

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.modalBackground}>
        <div className={styles.modalContainer}>
          <div className={styles.modalHeader}>
            <h2>Create New Rule</h2>
            <span className={styles.close} onClick={onclose}>
              &times;
            </span>
          </div>
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label htmlFor="connectionName">Rule Name</label>
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
                      <option key={index} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  {/* <label htmlFor="cronExpression">Duration</label>
                  <input
                    type="text"
                    id="cronExpression"
                    className={styles.input}
                    placeholder="* * * * *"
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                  /> */}
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
