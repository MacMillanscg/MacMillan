import React, { useState, useEffect } from "react";
import { LogsTabHeader } from "../LogsTabHeader";
import styles from "./LogsTab.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBug,
  faInfoCircle,
  faExclamationTriangle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../../../api";

const getIconForLogType = (type) => {
  switch (type) {
    case "Debug":
      return (
        <FontAwesomeIcon
          icon={faBug}
          className={`${styles.logIcon} ${styles.debug}`}
        />
      );
    case "Info":
      return (
        <FontAwesomeIcon
          icon={faInfoCircle}
          className={`${styles.logIcon} ${styles.info}`}
        />
      );
    case "Warn":
      return (
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className={`${styles.logIcon} ${styles.warn}`}
        />
      );
    case "Error":
      return (
        <FontAwesomeIcon
          icon={faTimesCircle}
          className={`${styles.logIcon} ${styles.error}`}
        />
      );
    default:
      return null;
  }
};

export const LogsTab = () => {
  const logs = [
    {
      id: 1,
      type: "Debug",
      timestamp: "08/25/2023 16:30:29",
      client: "client 1",
      integration: "Monday",
      connection: "Shopify",
      message: "Need to debug",
      details: "Execution started successfully...",
    },
    {
      id: 2,
      type: "Info",
      timestamp: "08/25/2023 16:30:29",
      client: "client 2",
      integration: "Tuesday",
      connection: "Amazon",
      message: "Execution successfully'",
      details: "Execution started successfully...",
    },
    {
      id: 3,
      type: "Warn",
      timestamp: "08/25/2023 16:30:29",
      client: "client 3",
      integration: "Wednesday",
      connection: "Eshipers",
      message: "Its the last time to check it",
      details: "Execution started successfully...",
    },
    {
      id: 4,
      type: "Error",
      timestamp: "08/25/2023 16:30:29",
      client: "client 4",
      integration: "Friday",
      connection: "",
      message: "Error in connection",
      details: "Execution started successfully...",
    },
  ];

  const [expandedLog, setExpandedLog] = useState(null);
  const [client, setClient] = useState([]);
  const [logss, setLogss] = useState([]);
  const [singleClientLog, setSingleClientLog] = useState([]);
  const { id } = useParams();

  // useEffect(() => {
  //   const fetchLogs = async () => {
  //     try {
  //       const response = await axios.get(`${url}/clients/addclients/${id}/log`);
  //       setLogss(response.data);
  //     } catch (error) {
  //       console.error("Error fetching logs:", error);
  //     }
  //   };

  //   fetchLogs();
  // }, []);

  useEffect(() => {
    const fetchLogsss = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/clients/addclients/logs`
        );
        // setLogs(response.data);
        console.log("response", response);
      } catch (error) {
        console.error("Error fetching log file data:", error);
      }
    };

    fetchLogsss();
  }, []);

  // const updatedLog = logss.filter((log) => log.userId === client.userId);
  // console.log("updatedLog", updatedLog);

  // console.log("logss", logss);

  useEffect(() => {
    const fetchClientSingleRecord = async () => {
      try {
        const response = await axios.get(`${url}/clients/${id}`);
        const clientData = response.data;
        setClient(clientData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClientSingleRecord();
  }, []);

  const handleExpand = (logId) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };
  console.log("clinets", client);
  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <h2>Logs</h2>
        <LogsTabHeader />
      </div>
      <div className={styles.logsContainer}>
        <table className={styles.logsTable}>
          <thead className={styles.tableHead}>
            <tr>
              <th>Type</th>
              <th>Message</th>
              <th>Timestamp</th>
              <th>Connection</th>
              {/* <th>Client</th> */}
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <React.Fragment key={log.id}>
                <tr
                  onClick={() => handleExpand(log.id)}
                  className={styles.logRow}
                >
                  <td>
                    {getIconForLogType(log.type)}
                    {log.type}
                  </td>
                  <td>{log.message}</td>
                  {/* <td>{log.timestamp}</td> */}
                  <td>{new Date(client.createdAt).toLocaleString()}</td>
                  <td>{log.connection}</td>
                  {/* <td>{log.client}</td> */}
                </tr>
                {expandedLog === log.id && (
                  <tr className={styles.expandedRow}>
                    <td className="pt-0">
                      <div className={styles.expandedContent}>
                        <p>
                          <strong>Instance:</strong> {log.integration}
                        </p>
                        <p>
                          <strong>Execution:</strong> {log.message}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
