import React, { useState, useEffect } from "react";
import styles from "./ClientsCom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";
import { AddClients } from "./AddClients";
import axios from "axios";
import { url } from "../../api";
import { getUser } from "../../storageUtils/storageUtils";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FilterPopup } from "./ClientDetails/FilterPopup/FilterPopup";
import { useSelector, useDispatch } from "react-redux";
import { fetchClients } from "../../Redux/Actions/ClientsActions";

export const ClientsCom = () => {
  const { dashboardWidth } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(false); // A state to trigger re-fetching
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredClients, setFilteredClients] = useState(clients);
  const dispatch = useDispatch();

  const applyFilters = ({ clientName, email }) => {
    console.log("clientName", clientName);
    console.log("email", email);

    // Filter if either clientName or email has a value
    const filteredData = clients.filter((client) => {
      const nameMatch = clientName
        ? client.clientName.toLowerCase().includes(clientName.toLowerCase())
        : true;

      const emailMatch = email
        ? client.email.toLowerCase().includes(email.toLowerCase())
        : true;

      // Return true if either name or email matches
      return nameMatch && emailMatch;
    });
    setFilteredClients(filteredData);
  };

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
        const response = await axios.get(`${url}/clients`);
        const updatedData = response.data;
        const userClients = updatedData.filter(
          (user) => user.userId === userId
        );
        // console.log("updated", userClients);
        setClients(userClients);
      } catch (error) {
        console.log(error);
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

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.clientHeader}>
        <h2 className={styles.heading2}>Clients</h2>
        <div className={styles.clientsRight}>
          <div className="form-group me-4">
            <input
              type="text"
              className={`form-control ${styles.formControl}`}
              id="exampleInputEmail"
              placeholder="Search clients"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
            />
            {/* <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} /> */}
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
        {filteredClients &&
          filteredClients.map((client) => {
            return (
              <Link
                to={`/addclients/${client._id}`}
                key={client._id}
                className={styles.cardLink}
                // style={{ width: "32%" }}
              >
                <div className="card me-1 mb-2">
                  <div className="card-body">
                    <h3>{client.clientName}</h3>
                    <h4 className={styles.heading4}>{client.email}</h4>
                    <h4 className={styles.heading4}>{client.phone}</h4>
                    {/* <h4>{new Date(client.createdAt).toLocaleString()}</h4> */}
                    <p className={styles.text}>
                      Lorem ipsum dolor sit amet consectetur adipisicing
                      elitsdf.
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      {isModalOpen && (
        <AddClients closeModal={closeModal} setFetchTrigger={setFetchTrigger} />
      )}
      {/* <ShopifyData /> */}
    </div>
  );
};
