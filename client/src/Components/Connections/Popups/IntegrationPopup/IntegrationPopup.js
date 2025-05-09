import React, { useState } from "react";
import styles from "./IntegrationPopup.module.css";
import axios from "axios";
import { url } from "../../../../api";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEShipperCredentials } from "../../../../Redux/Actions/EshipperActions";

export const IntegrationPopup = ({
  openShopifyPopup,
  openEShipperPopup,
  openHttpPopup,
  openOrdersPopup,
  newRules,
  selectedStepId,
}) => {
  const [searchInput, setSearchInput] = useState("");
  // const [token, setToken] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.eshipper.token);
  console.log("token", token);
  const loading = useSelector((state) => state.eshipper.loading);
  console.log("loading", loading);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleShopifyClick = () => {
    const shopifyData = {
      shopifyTitle: "Shopify", // Replace with actual data
      shopifyDetails: "Get Orders", // Replace with actual data
      newRules,
      selectedStepId,
    };

    axios
      .patch(`${url}/connections/${id}/addshopify`, shopifyData)
      .then((response) => {
        console.log("Shopify data saved:", response.data);
        // openShopifyPopup();
        openOrdersPopup();
      })
      .catch((error) => {
        console.error("Error saving Shopify data:", error);
      });
  };

  const handleHttpClick = () => {
    openHttpPopup();
  };
  const handleEShipperClick = () => {
    dispatch(
      verifyEShipperCredentials(
        id,
        "macmillan",
        "Apple@2024",
        openEShipperPopup
      )
    );
  };
  console.log("token ", token);

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
          <h4 className="m-0 mb-2">{loading ? "EShippers" : "EShippers"}</h4>
        </div>
        <div className={styles.actionDescription} onClick={handleHttpClick}>
          <h4 className="m-0 mb-2">HTTP Request</h4>
        </div>
      </div>
    </div>
  );
};
