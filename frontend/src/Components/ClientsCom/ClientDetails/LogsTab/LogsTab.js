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
import { fetchLogs } from "../../../../Redux/Actions/LoggerActions";
import { useSelector, useDispatch } from "react-redux";

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

export const LogsTab = () => {
  const [client, setClient] = useState([]);
  const [updatedLogs, setUpdatedLogs] = useState([]);
  const [connections, setConnections] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 6;

  const dispatch = useDispatch();
  const { logs } = useSelector((state) => state.logs);
  console.log("Log", logs);

  useEffect(() => {
    dispatch(fetchLogs());
  }, []);

  useEffect(() => {
    setUpdatedLogs(logs && logs.filter((log) => log.id === id));
  }, []);
  console.log("updatedlog", updatedLogs);

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
  }, [id]);

  useEffect(() => {
    const getConnections = async () => {
      setError(null);
      try {
        const response = await axios.get(`${url}/connections`);
        setConnections(response.data);
      } catch (err) {
        setError("Error fetching connections");
      }
    };
    getConnections();
  }, []);

  // Filter connections by clientId
  const filteredConnections = connections?.filter(
    (connection) => connection.client.clientId === id
  );

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
            </tr>
          </thead>
          <tbody>
            {updatedLogs &&
              updatedLogs.map((log, i) => (
                <tr className={styles.logRow} key={i}>
                  <td className="d-flex">
                    {getIconForLogType(log.level)}
                    {log.level}
                  </td>
                  <td>{log.message}</td>
                  <td>{log.timestamp}</td>
                  <td>{filteredConnections[0]?.connectionName}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
