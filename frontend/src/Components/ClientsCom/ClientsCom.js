import React, { useState, useEffect } from "react";
import styles from "./ClientsCom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";
import clientsData from "./ClientsData";
import { AddClients } from "./AddClients";
import { ShopifyData } from "./ShopifyData";
import axios from "axios";
import { url } from "../../api";

export const ClientsCom = () => {
  const { dashboardWidth } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(false); // A state to trigger re-fetching

  const userId =
    JSON.parse(localStorage.getItem("rememberMeUser"))._id ||
    JSON.parse(sessionStorage.getItem("userRecord"))._id;
  console.log("USERID", userId);

  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        const response = await axios.get(`${url}/clients`);
        console.log("status", response.status);
        const updatedData = response.data;
        const userClients = updatedData.filter(
          (user) => user.userId === userId
        );
        console.log("updated", userClients);
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
            <select name="" id="" className={styles.selectFilter}>
              <option value="">Filter</option>
              <option value="">client1</option>
              <option value="">client2</option>
              <option value="">client3</option>
            </select>
            {/* <FontAwesomeIcon
              icon={faChevronDown}
              className={styles.filterIcon}
            /> */}
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
        {clients &&
          clients.map((client) => {
            return (
              <Link
                to={`/addclients/${client._id}`}
                key={client._id}
                className={styles.cardLink}
                style={{ width: "32%" }}
              >
                <div className="card me-1 mb-2">
                  <div className="card-body">
                    <h3>{client.clientName}</h3>
                    <h4 className={styles.heading4}>{client.email}</h4>
                    <h4 className={styles.heading4}>{client.phone}</h4>
                    {/* <h4>{new Date(client.createdAt).toLocaleString()}</h4> */}
                    <p className={styles.text}>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
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
