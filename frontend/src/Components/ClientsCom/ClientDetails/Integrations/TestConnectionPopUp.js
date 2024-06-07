import React from "react";
import styles from "./IntegrationTab.module.css";

export const TestConnectionPopUp = ({ onClose, responseData, loading }) => {
  return (
    <div className={styles.popupTest}>
      <div className={styles.popupContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h3>Test Connection</h3>
            <hr />
            {responseData.status === 200 && (
              <>
                <p className={styles.para}>Status code: 200</p>
                <p className={styles.para}>
                  Description: Connection successfull
                </p>
              </>
            )}
            {responseData.status === 404 && (
              <>
                <p className={styles.para}>Status Code: 404</p>
                <p className={styles.para}>Description: Resource not found</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
