import React, { useState } from "react";
import styles from "./CancelPopUp.module.css";

export const CancelPopUp = ({
  setShowDialog,
  setName,
  setPhone,
  setSelectedFile,
  originalData,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
}) => {
  const handleOk = () => {
    setShowDialog(false);
    if (originalData) {
      setName(originalData.name);
      setPhone(originalData.phone);
      setSelectedFile(null);
    } else {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <div>
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h3 className={styles.warning}>Warning!</h3>
        </div>
        <div className={styles.dialogBody}>
          <p className={styles.continue}>
            You have unsaved data. Do you want to continue?
          </p>
        </div>
        <div className={styles.dialogFooter}>
          <button
            className={`${styles.btn} ${styles.btnOk}`}
            onClick={handleOk}
          >
            OK
          </button>
          <button
            className={`${styles.btn} ${styles.btnCancel}`}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
