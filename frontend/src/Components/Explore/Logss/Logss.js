import React, { useEffect, useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import { LogsTabHeader } from "../../ClientsCom/ClientDetails/LogsTabHeader";
import styles from "./Logss.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBug,
  faInfoCircle,
  faExclamationTriangle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../../api";
import { fetchLogs } from "../../../Redux/Actions/LoggerActions";
import { useSelector, useDispatch } from "react-redux";
import { fetchConnections } from "../../../Redux/Actions/ConnectionsActions";
import { fetchClients } from "../../../Redux/Actions/ClientsActions";
import { getUser } from "../../../storageUtils/storageUtils";

const getIconForLogType = (type) => {
  switch (type) {
    case "debug":
      return (
        <FontAwesomeIcon
          icon={faBug}
          className={`${styles.logIcon} ${styles.debug}`}
        />
      );
    case "info":
      return (
        <FontAwesomeIcon
          icon={faInfoCircle}
          className={`${styles.logIcon} ${styles.info}`}
        />
      );
    case "warn":
      return (
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className={`${styles.logIcon} ${styles.warn}`}
        />
      );
    case "error":
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

export const Logss = () => {
  const [filteredClients, setFilteredClients] = useState([]);
  const [filteredLogClients, setFilteredLogClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 6;

  const { dashboardWidth } = useAppContext();
  const localStorageUser = JSON.parse(localStorage.getItem("rememberMeUser"));
  const sessionStorageUser = JSON.parse(sessionStorage.getItem("userRecord"));
  const user = localStorageUser || sessionStorageUser;
  console.log("userssss", user._id);
  const dispatch = useDispatch();
  const { id } = useParams();

  const { logs } = useSelector((state) => state.logs);
  const { clients } = useSelector((state) => state.clients);
  const { connections } = useSelector((state) => state.connections);
  console.log("Log", logs);
  console.log("clients", clients);
  console.log("connections", connections);

  let userId = getUser();
  userId = userId?._id;

  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchConnections());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchClients());
  }, []);

  useEffect(() => {
    // Filter clients only once when clients or userId changes
    if (userId) {
      const matchedClients = clients.filter(
        (client) => client.userId === userId
      );
      setFilteredClients(matchedClients);
    }
  }, [clients, userId, logs]);

  useEffect(() => {
    // if (filteredClients.length > 0) {
    const clientIds = filteredClients.map((client) => client._id); // Extract client IDs
    console.log("Clientsids", clientIds);

    const matchedClientsLogs = logs
      .filter((log) => clientIds.includes(log.id))
      .map((log) => {
        // Find the connection for the current log based on clientId

        const matchingConnections = connections
          .filter((conn) => conn.client.clientId === log.id)
          .map((conn) => conn.connectionName);

        const client = clients.find((client) => client._id === log.id);
        const clientName = client ? client.clientName : "";
        return {
          ...log,
          connectionNames:
            matchingConnections.length > 0 ? matchingConnections : [],
          clientName,
        };
      });
    setFilteredLogClients(matchedClientsLogs);
    console.log("matchedClientsLogs", matchedClientsLogs);

    // }
  }, [logs, filteredClients, connections]);

  console.log("filteredclietns", filteredClients);
  console.log("filteredclietnsLogs", filteredLogClients);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogClients.slice(indexOfFirstLog, indexOfLastLog);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredLogClients.length / logsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
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
              {/* <th>Clients</th> */}
              <th>Connections</th>
              <th>Client</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log, i) => {
              return (
                <tr key={i}>
                  <td>
                    {getIconForLogType(log.level)}
                    {log.level}
                  </td>
                  <td>{log.message}</td>
                  <td>{log.timestamp}</td>
                  <td>
                    {log?.connectionNames.map((connection) => connection)}
                  </td>
                  <td>{log.clientName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.paginationContainer}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`${styles.paginationButton} ${
            currentPage === 1 ? "" : styles.activeButton
          }`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            disabled={currentPage === i + 1}
            className={`${styles.paginationButton} ${
              currentPage === i + 1 ? styles.activeButton : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`${styles.paginationButton} ${
            currentPage === totalPages ? "" : styles.activeButton
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
