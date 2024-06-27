import React from "react";
import styles from "./ConverterPopup.module.css";

export const ConverterPopup = () => {
  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search Actions"
        className={`${styles.searchInput} form-control mb-4`}
      />
      <div className={styles.loopOptionsWrap}>
        <div className={styles.actionDescription}>
          <h4 className={`m-0 mb-2`}>JSON to XML</h4>
          <p className={styles.logicDescription}>Convert JSON to XML.</p>
        </div>
        <div className={styles.actionDescription}>
          <h4 className={`m-0 mb-2`}>JSON to CSV</h4>
          <p className={styles.logicDescription}>Convert JSON to CSV</p>
        </div>
      </div>
    </div>
  );
};
