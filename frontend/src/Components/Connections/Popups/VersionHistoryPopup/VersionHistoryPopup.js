import React, { useState, useEffect } from "react";
import styles from "./VersionHistoryPopup.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { url } from "../../../../api";
import { useSelector, useDispatch } from "react-redux";
import { fetchConnections } from "../../../../Redux/Actions/ConnectionsActions";

export const VersionHistoryPopup = ({
  onClose,
  onSave,
  filteredConnection,
}) => {
  console.log("filterconnect", filteredConnection?.versions);
  const data = filteredConnection?.versions.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  console.log("data", data);

  const latest = data[0];
  const secondLatest = data[1];

  console.log("Latest:", latest);
  console.log("Second Latest:", secondLatest);

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
                <div className={styles.currentBadge}>Current</div>{" "}
                <span>{latest ? latest.versionNumber : ""}</span>
                {/* If no versions exist, show the unpublished draft message */}
                {!data || data.length === 0 ? (
                  <div className={styles.noVersionsMessage}>
                    <p>Unpublished draft</p>
                    <p>You have unpublished changes.</p>
                  </div>
                ) : (
                  <div className={styles.versionDetails}>
                    {/* If versions exist, display latest and second latest */}

                    <div>
                      <h4>Second Latest Version:</h4>
                      <p>
                        {secondLatest
                          ? secondLatest.versionNumber
                          : "No details available"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
