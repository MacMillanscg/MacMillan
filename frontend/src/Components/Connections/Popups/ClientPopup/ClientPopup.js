import React from "react";
import styles from "./ClientPopup.module.css"; // Import the CSS module

export const ClientPopup = ({ onClose }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <h3>Client details</h3>
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
              <label htmlFor="category">Category</label>
              <input type="text" id="category" />
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
