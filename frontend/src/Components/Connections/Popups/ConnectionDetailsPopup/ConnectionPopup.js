import React from "react";
import styles from "./ConnectionPopup.module.css"; // Import the CSS module

export const ConnectionPopup = ({ onClose }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <h3>Connection details</h3>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.popupBody}>
          <form>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <input type="text" id="description" />
            </div>
            <div className={styles.btns}>
              <button className={styles.save}>Save</button>
              <button className={styles.cancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
