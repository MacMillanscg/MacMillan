import React from "react";
import styles from "./WarningPopup.module.css"; // Create and import a CSS file for styling the modal

export const WarningPopup = ({ show, onClose, onConfirm }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h4 className={styles.heading}>Warning</h4>
        <p className={styles.description}>
          Are you sure you want to delete this record?
        </p>
        <div className={styles.modalAction}>
          <button className={styles.yes} onClick={onConfirm}>
            Yes
          </button>
          <button className={styles.no} onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};
