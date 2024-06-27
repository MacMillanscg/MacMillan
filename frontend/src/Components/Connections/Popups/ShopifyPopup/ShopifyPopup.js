import React from "react";
import styles from "./ShopifyPopup.module.css";

export const ShopifyPopup = () => {
  return (
    <div className={styles.popupContent}>
      <div className={styles.loopOptionsWrap}>
        <h4 className="m-0 mb-2 fs-4">Shopify</h4>
        <select name="" id="">
          <option value="">Select any</option>
          <option value="">List orders</option>
          <option value="">Get orders</option>
        </select>
      </div>
    </div>
  );
};
