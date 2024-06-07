import React, { useState } from "react";
import { LogsTabHeader } from "../LogsTabHeader";
import styles from "./LogsTab.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBug,
  faInfoCircle,
  faExclamationTriangle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

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
      connection: "Connection A",
      message: "Message 1",
    },
    {
      id: 2,
      type: "Info",
      timestamp: "08/25/2023 16:30:29",
      client: "client 2",
      connection: "Connection B",
      message: "Message 2'",
    },
    {
      id: 3,
      type: "Warn",
      timestamp: "08/25/2023 16:30:29",
      client: "client 3",
      connection: "Connection C",
      message: "Message 3'",
    },
    {
      id: 4,
      type: "Error",
      timestamp: "08/25/2023 16:30:29",
      client: "client 4",
      connection: "Connection D",
      message: "Message 4'",
    },
  ];

  const [expandedLog, setExpandedLog] = useState(null);

  const handleExpand = (logId) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };
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
              <th>Client</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <React.Fragment key={log.id}>
                <tr
                  // onClick={() => handleExpand(log.id)}
                  className={styles.logRow}
                >
                  <td>
                    {getIconForLogType(log.type)}
                    {log.type}
                  </td>
                  <td>{log.message}</td>
                  <td>{log.timestamp}</td>
                  <td>{log.connection}</td>
                  <td>{log.client}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
