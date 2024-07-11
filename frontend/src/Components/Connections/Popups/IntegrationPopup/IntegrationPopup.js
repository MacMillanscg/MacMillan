import React, { useState } from "react";
import styles from "./IntegrationPopup.module.css";
import axios from "axios";
import { url } from "../../../../api";
import { useParams } from "react-router-dom";

export const IntegrationPopup = ({
  openShopifyPopup,
  openEShipperPopup,
  openHttpPopup,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const { id } = useParams();

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleShopifyClick = () => {
    const shopifyData = {
      shopifyTitle: "Shopify", // Replace with actual data
      shopifyDetails: "Get Orders", // Replace with actual data
    };

    axios
      .patch(`${url}/connections/${id}/addshopify`, shopifyData)
      .then((response) => {
        console.log("Shopify data saved:", response.data);
        openShopifyPopup();
      })
      .catch((error) => {
        console.error("Error saving Shopify data:", error);
      });
  };

  const handleEShipperClick = () => {
    openEShipperPopup();
  };

  const handleHttpClick = () => {
    openHttpPopup();
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
          <h4 className="m-0 mb-2">Shopify</h4>
        </div>
        <div className={styles.actionDescription} onClick={handleEShipperClick}>
          <h4 className="m-0 mb-2">eShippers</h4>
        </div>
        <div className={styles.actionDescription} onClick={handleHttpClick}>
          <h4 className="m-0 mb-2">HTTP Request</h4>
        </div>
      </div>
    </div>
  );
};
