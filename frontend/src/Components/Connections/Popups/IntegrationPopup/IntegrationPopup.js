import React from "react";
import styles from "./IntegrationPopup.module.css";

export const IntegrationPopup = ({ openShopifyPopup, openEShipperPopup }) => {
  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search integration"
        className={`${styles.searchInput} form-control mb-4`}
      />
      <div className={styles.loopOptionsWrap}>
        <div className={styles.actionDescription} onClick={openShopifyPopup}>
          <h4 className={`m-0 mb-2`}>Shopify</h4>
          {/* <p className={styles.logicDescription}>Shopify details.</p> */}
        </div>
        <div className={styles.actionDescription} onClick={openEShipperPopup}>
          <h4 className={`m-0 mb-2`}>eShippers</h4>
          {/* <p className={styles.logicDescription}>eShippers details</p> */}
        </div>
        <div className={styles.actionDescription}>
          <h4 className={`m-0 mb-2`}>HTTP Request</h4>
          {/* <p className={styles.logicDescription}>HTTP Request details</p> */}
        </div>
      </div>
    </div>
  );
};
