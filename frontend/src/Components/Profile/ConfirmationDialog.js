import React from "react";
import styles from "./Confirm.module.css";

export const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className={styles.dialog}>
      <div className={styles.dialogHeader}>
        <h3 className={styles.warning}>Warning!</h3>
      </div>
      <div className={styles.dialogBody}>
        <p className={styles.continue}>Are you sure you want to logout ?</p>
      </div>
      <div className={styles.dialogFooter}>
        <button className={`${styles.btn} ${styles.btnOk}`} onClick={onConfirm}>
          OK
        </button>
        <button
          className={`${styles.btn} ${styles.btnCancel}`}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
