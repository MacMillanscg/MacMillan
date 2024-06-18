import React from "react";
import styles from "./VersionHistoryPopup.module.css"; // Import the CSS module

export const VersionHistoryPopup = ({ onClose, onSave }) => {
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
          <button className={styles.saveButton} onClick={onSave}>
            Save & Publish
          </button>
        </div>
        <div className={styles.popupBody}>
          <div className={styles.toggleSwitch}>
            <label>
              Hide unavailable versions
              <input type="checkbox" />
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
