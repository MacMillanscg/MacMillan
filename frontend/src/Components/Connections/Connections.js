import React, { useState, useEffect } from "react";
import styles from "./Connections.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faPlus,
  faEllipsisV,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";
import { AddConnections } from "./AddConnections";
import { useSelector, useDispatch } from "react-redux";
import { fetchConnections } from "../../Redux/Actions/ConnectionsActions";
import { WarningPopup } from "./Popups/WarningPopup/WarningPopup";
import axios from "axios";
import { url } from "../../api";
import toast from "react-hot-toast";
import { FilterPopup } from "./Popups/FilterPopup/FilterPopup";

export const Connections = () => {
  const { dashboardWidth } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [connectionId, setConnectionId] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input
  const [filteredConnections, setFilteredConnections] = useState([]); // Filtered connections state

  const dispatch = useDispatch();
  const { connections, loading, error } = useSelector(
    (state) => state.connections
  );
  const token = useSelector((state) => state.eshipper.token);

  useEffect(() => {
    dispatch(fetchConnections());
  }, [dispatch]);

  useEffect(() => {
    setFilteredConnections(connections); // Set initial filtered connections to all connections
  }, [connections]);

  // Apply Search Filter (based only on search query)
  const applySearchFilter = () => {
    const filteredData = connections.filter((connection) => {
      return connection.connectionName
        ? connection.connectionName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;
    });
    setFilteredConnections(filteredData); // Update filtered connections
  };

  // Apply Filter and Search Logic (for FilterPopup)
  const applyFiltersAndSearch = ({ connectionName, clientName }) => {
    const filteredData = connections.filter((connection) => {
      const nameMatch = connection.connectionName
        ? connection.connectionName
            .toLowerCase()
            .includes(connectionName.toLowerCase())
        : true;

      const clientMatch = connection.client?.clientName
        ? connection.client.clientName
            .toLowerCase()
            .includes(clientName.toLowerCase())
        : true;

      const searchMatch = connection.connectionName
        ? connection.connectionName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;

      return nameMatch && clientMatch && searchMatch;
    });
    setFilteredConnections(filteredData); // Update filtered connections
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsFilterModalOpen(false);
  };

  const handleDeleteConnection = (id) => {
    setConnectionId(id);
    setShowWarningModal(true);
  };

  const confirmDeleteConnection = async () => {
    try {
      await axios.delete(`${url}/connections/${connectionId}`);
      dispatch(fetchConnections());
      setShowWarningModal(false);
      toast.success("The connection deleted successfully.");
    } catch (error) {
      console.error("Error deleting connection:", error);
    }
  };

  const openFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  // Trigger the search filter when user changes the search query
  useEffect(() => {
    applySearchFilter();
  }, [searchQuery]);

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.connectionHeader}>
        <h2 className={styles.heading2}>Connections</h2>
        {showWarningModal && (
          <WarningPopup
            show={showWarningModal}
            onClose={() => setShowWarningModal(false)}
            onConfirm={confirmDeleteConnection}
          />
        )}

        <div className={styles.connectionsRight}>
          <div className="form-group me-4">
            <input
              type="text"
              className={`form-control ${styles.formControl}`}
              id="search"
              placeholder="Search Connections"
              value={searchQuery} // Bind search query to input field
              onChange={handleSearchChange} // Handle search input change
            />
          </div>
          <div className={styles.selectFilterOption}>
            <button className={styles.filterBtn} onClick={openFilterModal}>
              Filter
              <FontAwesomeIcon
                icon={faChevronDown}
                className={styles.filterIcon}
              />
            </button>
            {isFilterModalOpen && (
              <FilterPopup
                closeModal={closeModal}
                applyFilters={applyFiltersAndSearch} // Apply additional filters (including search)
              />
            )}
          </div>
          <button
            className={`btn btn-success ${styles.addBtn} ms-4`}
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
            Add Connection
          </button>
        </div>
      </div>
      <div className={styles.cardSection}>
        {filteredConnections &&
          filteredConnections.map((connection, index) => {
            // Find the latest version
            const latestVersion = connection.versions?.reduce(
              (latest, version) =>
                latest === null ||
                new Date(version.createdAt) > new Date(latest.createdAt)
                  ? version
                  : latest,
              null
            );

            return (
              <Link
                to={`/connections/${connection._id}`}
                className={styles.cardWrap}
                key={index}
              >
                <div className={`card ${styles.connectionCard}`}>
                  <div className="card-body">
                    <div className={styles.cardTop}>
                      <h3 className={styles.cardTitle}>
                        {connection?.shopifyDetails?.shopifyTitle}
                      </h3>
                      <div className={styles.EditDeleteShow}>
                        <FontAwesomeIcon
                          icon={faEllipsisV}
                          className={styles.dots}
                        />
                        <div className={styles.editDelteIconsWrap}>
                          <Link to={`/connections/${connection._id}`}>
                            <FontAwesomeIcon
                              icon={faPencil}
                              className={styles.editIcon}
                            />
                          </Link>
                          <FontAwesomeIcon
                            icon={faTrash}
                            className={styles.deleteIcon}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteConnection(connection._id);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <h4 className="fs-5 m-0 mb-2">
                      {connection.client.clientName}
                    </h4>
                    <h4 className="fs-5 m-0 mb-2">
                      {connection.connectionName}
                    </h4>
                    <div className="category">
                      <ul className={styles.list}>
                        <li className={styles.listItem}>
                          <span className={styles.listText}>
                            Version:{" "}
                            {latestVersion
                              ? latestVersion.versionNumber
                              : "Null"}
                          </span>
                        </li>

                        <li className={styles.listItem}>
                          <Link to="#" className={styles.listText}>
                            Last Run
                          </Link>
                        </li>
                        <li className={styles.listItem}>
                          <span>Has not run</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>

      {isModalOpen && <AddConnections closeModal={closeModal} />}
    </div>
  );
};
