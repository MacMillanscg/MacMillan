import React, { useState, useEffect } from "react";
import styles from "./ClientPopup.module.css"; // Import the CSS module
import { url } from "../../../../api";
import axios from "axios";
import { useParams } from "react-router-dom";

export const ClientPopup = ({ onClose }) => {
  const { id } = useParams();
  const [clientId, setClientId] = useState(null);
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const fetchConnectionDetails = async () => {
      try {
        const response = await axios.get(`${url}/connections/${id}`);
        console.log("ressss", response.data.client);
        const connection = response.data;
        setClientId(connection.client);
      } catch (error) {
        console.error("Error fetching connection details:", error);
      }
    };

    fetchConnectionDetails();
  }, [id]);

  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        const response = await axios.get(`${url}/clients`);
        const updatedData = response.data;
        const newClient = updatedData.filter(
          (data, i) => data._id === clientId
        );
        setClientName(newClient[0]?.clientName);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllClients();
  }, [clientId]);

  console.log("clientname", clientName);

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <h3>Client details</h3>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.popupBody}>
          <form>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <input type="text" id="category" />
            </div>
            <div className={styles.btns}>
              <button className={styles.save}>Save</button>
              <button className={styles.cancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
