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
  const [logsPerPage, setLogsPerPage] = useState(10); // Initial logs per page set to 10

  const { dashboardWidth } = useAppContext();
  const localStorageUser = JSON.parse(localStorage.getItem("rememberMeUser"));
  const sessionStorageUser = JSON.parse(sessionStorage.getItem("userRecord"));
  const user = localStorageUser || sessionStorageUser;
  const dispatch = useDispatch();
  const { id } = useParams();

  const { logs } = useSelector((state) => state.logs);
  const { clients } = useSelector((state) => state.clients);
  const { connections } = useSelector((state) => state.connections);

  let userId = getUser();
  userId = userId?._id;

  useEffect(() => {
    dispatch(fetchLogs());
    dispatch(fetchConnections());
    dispatch(fetchClients());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      const matchedClients = clients.filter(
        (client) => client.userId === userId
      );
      setFilteredClients(matchedClients);
    }
  }, [clients, userId, logs]);

  useEffect(() => {
    const clientIds = filteredClients.map((client) => client._id);

    const matchedClientsLogs = logs
      .filter((log) => clientIds.includes(log.id))
      .map((log) => {
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
  }, [logs, filteredClients, connections]);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogClients.slice(indexOfFirstLog, indexOfLastLog);

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

  // Handle the change in the number of logs per page
  const handleLogsPerPageChange = (e) => {
    setLogsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page on selection change
  };

  return (
    <div
      className={`dashboard ${styles.dashboardLog}`}
      style={{ width: dashboardWidth }}
    >
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
              <th>Connections</th>
              <th>Client</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log, i) => (
              <tr key={i}>
                <td>
                  {getIconForLogType(log.level)}
                  {log.level}
                </td>
                <td>{log.message}</td>
                <td>{log.timestamp}</td>
                <td>
                  {log?.connectionNames.map((connection, index) => (
                    <div key={index}>{connection}</div>
                  ))}
                </td>
                <td>{log.clientName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pageControls}>
        <div className={styles.logsRecordsOption}>
          <select
            onChange={handleLogsPerPageChange}
            value={logsPerPage}
            className={styles.logsPerPageSelect}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className={styles.pagination}>
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
    </div>
  );
};
