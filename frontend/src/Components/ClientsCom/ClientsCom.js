import React, { useState, useEffect, useRef } from "react";
import styles from "./ClientsCom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencil,
  faTrash,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";
import { AddClients } from "./AddClients";
import axios from "axios";
import { url } from "../../api";
import { getUser } from "../../storageUtils/storageUtils";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FilterPopup } from "./ClientDetails/FilterPopup/FilterPopup";
import { useDispatch } from "react-redux";
import { fetchClients } from "../../Redux/Actions/ClientsActions";
import { ConfirmCancelPopUp } from "../Common/ConfirmCancelPopUp/ConfirmCancelPopUp";
import { Spinner } from "../Spinner/Spinner";

export const ClientsCom = () => {
  const { dashboardWidth } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(false); // A state to trigger re-fetching
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredClients, setFilteredClients] = useState(clients);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [showdeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const applyFilters = ({ clientName, email }) => {
    const filteredData = clients.filter((client) => {
      const nameMatch = clientName
        ? client.clientName.toLowerCase().includes(clientName.toLowerCase())
        : true;

      const emailMatch = email
        ? client.email.toLowerCase().includes(email.toLowerCase())
        : true;

      return nameMatch && emailMatch;
    });
    setFilteredClients(filteredData);
  };

  useEffect(() => {
    dispatch(fetchClients());
  }, []);

  useEffect(() => {
    setFilteredClients(clients);
  }, [clients]);

  const openFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  let userId = getUser();
  userId = userId?._id;

  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`${url}/clients`);
        const updatedData = response.data;
        const userClients = updatedData.filter(
          (user) => user.userId === userId
        );
        setClients(userClients);
        setLoading(false); // End loading
      } catch (error) {
        console.log(error);
        setLoading(false); // End loading even on error
      }
    };
    fetchAllClients();
  }, [fetchTrigger, userId]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsFilterModalOpen(false);
    setIsModalOpen(false);
  };

  // Handler for search input
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    // Filter clients based on search term
    const filteredData = clients.filter((client) =>
      client.clientName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredClients(filteredData);
  };
  const handleDeletModal = (clientId) => {
    setShowDeleteModal(true);
    setClientToDelete(clientId);
  };
  console.log("clientTODelete", clientToDelete);

  // Handler for deleting the client
  const handleDelete = async () => {
    // if (!clientToDelete) return;

    try {
      // Perform the delete API request
      await axios.delete(`${url}/clients/${clientToDelete}`);
      // After successful deletion, remove the client from the state
      setClients((prevClients) =>
        prevClients.filter((client) => client._id !== clientToDelete)
      );
      setFilteredClients((prevClients) =>
        prevClients.filter((client) => client._id !== clientToDelete)
      );
      setShowDeleteModal(false); // Close the delete modal
      setClientToDelete(null); // Reset the client ID to delete
    } catch (error) {
      console.log("Error deleting client:", error);
    }
  };

  console.log("all clients", filteredClients);

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      {showdeleteModal && (
        <ConfirmCancelPopUp
          headerText="Warning"
          bodyText="Are you sure you want to delete this record?"
          onOk={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          okButtonText="Yes"
          cancelButtonText="No"
        />
      )}
      <div className={styles.clientHeader}>
        <h2 className={styles.heading2}>Clients</h2>
        <div className={styles.clientsRight}>
          <div className="form-group me-4">
            <input
              type="text"
              className={`form-control ${styles.formControl}`}
              id="searchBar"
              placeholder="Search clients"
              value={searchTerm} // Bind to searchTerm state
              onChange={handleSearch} // Trigger search on input change
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
                applyFilters={applyFilters}
              />
            )}
          </div>
          <button
            className={`btn btn-success ${styles.addBtn} ms-4`}
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
            Add Client
          </button>
        </div>
      </div>
      <div className={styles.cardSection}>
        {loading ? (
          <Spinner
            isLoading={loading}
            message="Loading clients, please wait..."
          />
        ) : (
          filteredClients &&
          filteredClients.map((client) => (
            <Link
              to={`/addclients/${client._id}`}
              key={client._id}
              className={styles.cardLink}
            >
              <div className="card me-1 mb-2">
                <div className="card-body">
                  <div className={styles.cardTop}>
                    <h3 className={styles.clientName}>{client.clientName}</h3>
                    <div className={styles.EditDeleteShow}>
                      <FontAwesomeIcon
                        icon={faEllipsisV}
                        className={styles.dots}
                      />
                      <div className={styles.editDelteIconsWrap}>
                        <Link to={`/addclients/${client._id}`}>
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
                            handleDeletModal(client._id);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <h4 className={styles.heading4}>{client.email}</h4>
                  <h4 className={styles.heading4}>{client.phone}</h4>
                  <div>
                    <span
                      className={
                        client.isActive ? styles.activeDot : styles.inactiveDot
                      }
                    ></span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {isModalOpen && (
        <AddClients closeModal={closeModal} setFetchTrigger={setFetchTrigger} />
      )}
    </div>
  );
};
