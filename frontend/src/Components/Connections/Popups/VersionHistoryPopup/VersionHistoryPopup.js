import React, { useState } from "react";
import styles from "./VersionHistoryPopup.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { url } from "../../../../api";

export const VersionHistoryPopup = ({ onClose, onSave }) => {
  const [hideUnavailable, setHideUnavailable] = useState(false);
  const { id } = useParams();

  const handleToggleChange = (e) => {
    setHideUnavailable(e.target.checked);
  };

  console.log("hide", hideUnavailable);
  console.log("history id", id);

  const handleSave = async () => {
    try {
      // const updatedData = { hideUnavailable };
      const response = await axios.put(
        `${url}/connections/${id}`,
        hideUnavailable
      );
      console.log("res", response.data);
      // onSave();
    } catch (error) {
      console.error("Error updating connection:", error);
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <h3>Version history</h3>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.popupActions}>
          <button className={styles.saveButton} onClick={handleSave}>
            Save & Publish
          </button>
        </div>
        <div className={styles.popupBody}>
          <div className={styles.toggleSwitch}>
            <label>
              Hide unavailable versions
              <input
                type="checkbox"
                checked={hideUnavailable}
                onChange={handleToggleChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          <div className={styles.versionTable}>
            <div className={styles.tableHeader}>
              <span>Version</span>
              <span>Available</span>
            </div>
            <div className={styles.tableBody}>
              <div className={styles.tableRow}>
                <div className={styles.currentBadge}>Current</div>
                <div>Unpublished draft</div>
                <div className={styles.tableCell}>
                  You have unpublished changes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
