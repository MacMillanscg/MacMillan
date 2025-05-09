import React, { useState, useEffect } from "react";
import styles from "./ConnectionPopup.module.css"; // Import the CSS module
import { url } from "../../../../api";
import axios from "axios";
import { useParams } from "react-router-dom";

export const ConnectionPopup = ({ onClose }) => {
  const { id } = useParams();
  const [connectionName, setConnectionName] = useState("");
  const [description, setDescription] = useState("");
  const [originalData, setOriginalData] = useState({
    connectionName: "",
    description: "",
  });
  useEffect(() => {
    const fetchConnectionDetails = async () => {
      try {
        const response = await axios.get(`${url}/connections/${id}`);
        console.log("ressss", response);
        const connection = response.data;
        setConnectionName(connection.connectionName);
        setDescription(connection.description || ""); // Set description if available
      } catch (error) {
        console.error("Error fetching connection details:", error);
      }
    };

    fetchConnectionDetails();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // const updatedData = { connectionName, description };
      const response = await axios.put(`${url}/connections/${id}`, {
        description,
      });
      console.log("Server response:", response.data);
      onClose();
    } catch (error) {
      console.error("Error updating connection:", error);
    }
  };

  const cancelPopup = () => {
    setConnectionName("");
    setDescription("");
    onClose();
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <h3>Connection details</h3>
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
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className={styles.btns}>
              <button className={styles.save} onClick={handleSave}>
                Save
              </button>
              <button className={styles.cancel} onClick={cancelPopup}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
