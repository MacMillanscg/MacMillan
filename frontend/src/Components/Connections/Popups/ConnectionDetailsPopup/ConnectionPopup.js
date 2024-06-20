import React, { useState } from "react";
import styles from "./ConnectionPopup.module.css"; // Import the CSS module
import { url } from "../../../../api";
import axios from "axios";
import { useParams } from "react-router-dom";

export const ConnectionPopup = ({ onClose }) => {
  const { id } = useParams();
  const [connectionName, setConnectionName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const connectionPopup = { connectionName, description };
      const response = await axios.put(`${url}/connections/${id}`, {
        connectionPopup,
      });
      console.log("Server response:", response.data);
      onClose();
    } catch (error) {
      console.error("Error updating connection:", error);
    }
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
              <button className={styles.cancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
