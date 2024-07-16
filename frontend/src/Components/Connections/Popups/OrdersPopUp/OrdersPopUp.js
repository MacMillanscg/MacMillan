import React, { useState } from "react";
import styles from "./OrdersPopUp.module.css";
import axios from "axios";
import { url } from "../../../../api";
import { useParams } from "react-router-dom";

export const OrdersPopUp = ({
  openShopifyPopup,
  closeOrderPopup,
  openFullfilmentPopup,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const { id } = useParams();

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleShopifyClick = () => {
    openShopifyPopup();
    closeOrderPopup();
  };

  const handleFullFillmentClick = () => {
    openFullfilmentPopup();
    closeOrderPopup();
  };

  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search integration"
        className={`${styles.searchInput} form-control mb-2`}
        value={searchInput}
        onChange={handleSearchChange}
      />
      <div className={styles.loopOptionsWrap}>
        <div className={styles.actionDescription} onClick={handleShopifyClick}>
          <h4 className="m-0 mb-2">Orders</h4>
        </div>
        <div
          className={styles.actionDescription}
          onClick={handleFullFillmentClick}
        >
          <h4 className="m-0 mb-2">Fulfilment</h4>
        </div>
        <div className={styles.actionDescription}>
          <h4 className="m-0 mb-2">Tracking</h4>
        </div>
      </div>
    </div>
  );
};
