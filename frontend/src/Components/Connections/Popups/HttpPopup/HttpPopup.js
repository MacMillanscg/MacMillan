import React from "react";
import styles from "./HttpPopup.module.css";

export const HttpPopup = () => {
  return (
    <div className={styles.popupContent}>
      <div className={styles.loopOptionsWrap}>
        <h4 className="m-0 mb-2 fs-4">HTTP Request</h4>
        <select name="" id="">
          <option value="">Select any</option>
          <option value="">GET HTTP Request</option>
          <option value="">POST HTTP Request</option>
          <option value="">PUT HTTP Request </option>
        </select>
      </div>
    </div>
  );
};
