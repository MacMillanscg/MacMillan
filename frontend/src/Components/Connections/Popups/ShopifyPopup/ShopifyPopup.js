import React from "react";
import styles from "./ShopifyPopup.module.css";

export const ShopifyPopup = ({ fetchShopifyOrders }) => {
  return (
    <div className={styles.popupContent}>
      <div className={styles.loopOptionsWrap}>
        <h4 className="m-0 mb-2 fs-4">Shopify</h4>
        <div className={styles.shopifyPopup}>
          <div className={styles.items}>List Orders</div>
          <div className={styles.items} onClick={fetchShopifyOrders}>
            Get Orders
          </div>
        </div>
      </div>
    </div>
  );
};
