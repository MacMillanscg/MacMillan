import React, { useState } from "react";
import axios from "axios";
import styles from "./FullfilmentPopup.module.css";
import { url } from "../../../../api";
import { useParams } from "react-router-dom";

export const FullfilmentPopUp = ({
  openShopifyPopup,
  closeOrderPopup,
  openFullfilmentPopup,
  onClose,
}) => {
  const [orderId, setOrderId] = useState("5464562401494");
  const [fulfillmentDetails, setFulfillmentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postFullfillment, setPostFullfillment] = useState(
    "Shopify Post Fullfillment"
  );

  const { id } = useParams();
  console.log("id shopofi", id);

  const handleFullFillmentClick = async () => {
    try {
      const fulfillmentId = "5464562401494";
      const trackingNumber = "1Z001985YW997441111";
      const trackingCompany = "MacMillan";
      // const connectionId = "66b2181c6e2485b2c9eeb8e5";

      // const postFullfillments = {
      //   status: "success",
      //   updated_at: new Date().toISOString(),
      //   postFullfillment: postFullfillment,
      // };

      const response = await axios.patch(
        `${url}/connections/update-fulfillment`,
        {
          id,
          fulfillmentId,
          trackingNumber,
          trackingCompany,
          postFullfillment,
        }
      );

      console.log("Fulfillment data updated:", response.data);
      // openFullfilmentPopup();
      // closeOrderPopup();
      onClose();
    } catch (error) {
      console.error("Error posting fulfillment:", error);
    }
  };

  const fetchFulfillmentDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${url}/connections/get-fulfillment/${orderId}`
      );
      setFulfillmentDetails(response);
    } catch (error) {
      setError("Failed to fetch fulfillment details");
      console.error("Error fetching fulfillment details:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("fullfillment", fulfillmentDetails);

  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search integration"
        className={`${styles.searchInput} form-control mb-2`}
        // value={searchInput}
        // onChange={handleSearchChange}
      />
      <div className={styles.loopOptionsWrap}>
        <div
          className={styles.actionDescription}
          onClick={handleFullFillmentClick}
        >
          <h4 className="m-0 mb-2">Post Fullfilment</h4>
        </div>
        <div
          className={styles.actionDescription}
          onClick={fetchFulfillmentDetails}
        >
          <h4 className="m-0 mb-2">Post tracking no.</h4>
        </div>
      </div>
    </div>
  );
};
