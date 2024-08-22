import React from "react";
import styles from "./EShippersPopup.module.css";
import axios from "axios";
import { url } from "../../../../api";
import { useDispatch, useSelector } from "react-redux";

export const EShippersPopup = () => {
  const token = useSelector((state) => state.eshipper.token);

  const getShipmentDetails = async () => {
    const orderId = "8000000010946";
    try {
      const response = await axios.get(
        `https://uu2.eshipper.com/api/v2/ship/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Shipment Details:", response.data);
    } catch (error) {
      console.error(
        "Error fetching shipment:",
        error.response ? error.response.data : error.message
      );
    }
  };

  console.log("shipment token", token);
  return (
    <div className={styles.popupContent}>
      <div className="dsdf">
        <h4 className="m-0 mb-2 fs-4">EShippers</h4>
        <div className={styles.eShipperPopup}>
          <div className={styles.items} onClick={getShipmentDetails}>
            Shipments
          </div>
          <div className={styles.items}>Shipment Events</div>
        </div>
      </div>
    </div>
  );
};
