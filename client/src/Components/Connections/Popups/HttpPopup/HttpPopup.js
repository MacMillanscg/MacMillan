import React from "react";
import styles from "./HttpPopup.module.css";

export const HttpPopup = () => {
  return (
    <div className={styles.popupContent}>
      <div className={styles.loopOptionsWrap}>
        <h4 className="m-0 mb-2 fs-4">HTTP Request</h4>
        <div className={styles.items}>GET HTTP Request</div>
        <div className={styles.items}>POST HTTP Request</div>
        <div className={styles.items}>PUT HTTP Request</div>
      </div>
    </div>
  );
};
