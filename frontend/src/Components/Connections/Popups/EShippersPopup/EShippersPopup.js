import React from "react";
import styles from "./EShippersPopup.module.css";

export const EShippersPopup = () => {
  return (
    <div className={styles.popupContent}>
      <div className={styles.loopOptionsWrap}>
        <h4 className="m-0 mb-2 fs-4">EShippers</h4>
        <select name="" id="">
          <option value="">Select any</option>
          <option value="">Update Order Status</option>
          <option value="">Update Tracking Events</option>
        </select>
      </div>
    </div>
  );
};
