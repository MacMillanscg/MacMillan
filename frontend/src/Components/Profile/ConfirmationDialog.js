import React from "react";
import styles from "./Confirm.module.css";

export const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className={`dialog-overlay ${styles.confirm}`}>
      <div className="dialog-content">
        <p className={`mb-3 ${styles.para}`}>
          Are you sure you want to logout?
        </p>
        <button className={styles.okay} onClick={onConfirm}>
          OK
        </button>
        <button className={styles.cancel} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};
