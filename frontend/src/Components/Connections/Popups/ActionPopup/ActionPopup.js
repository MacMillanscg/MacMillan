import React from "react";
import styles from "./ActionPopup.module.css";
// This is branch action popup

export const ActionPopup = () => {
  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search components"
        className={`${styles.searchInput} form-control mb-4`}
      />
      <div className={styles.actionDescription}>
        <h4 className={`m-0 mb-2`}>Branch on Expression</h4>
        <p className={styles.logicDescription}>
          Choose which step to execute next based on a condition.
        </p>
      </div>
      <div className={styles.actionDescription}>
        <h4 className={`m-0 mb-2`}>Branch on Value</h4>
        <p className={styles.logicDescription}>
          Choose which step to execute next based on a value.
        </p>
      </div>
      <div className={styles.actionDescription}>
        <h4 className={`m-0 mb-2`}>Select Executed Step Result</h4>
        <p className={styles.logicDescription}>
          Given a collection of step results, returns the results of whichever
          step was executed and returned a result.
        </p>
      </div>
    </div>
  );
};
