import React from "react";
import styles from "./IntegrationTab.module.css";

export const TestConnectionPopUp = ({ onClose, responseData }) => {
  console.log("abcccc", responseData.status);
  return (
    <div className={styles.popupTest}>
      <div className={styles.popupContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        {responseData.status === 200 && (
          <p className={styles.para}>Connection established successfully</p>
        )}
        {responseData.status === 404 && (
          <p className={styles.para}>Resource not found</p>
        )}
      </div>
    </div>
  );
};
