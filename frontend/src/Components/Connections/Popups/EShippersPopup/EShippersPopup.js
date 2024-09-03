import React, { useState, useEffect } from "react";
import styles from "./EShippersPopup.module.css";
import axios from "axios";
import { url } from "../../../../api";
import { useDispatch, useSelector } from "react-redux";
import { data } from "./ShippmentData";
import { useParams } from "react-router-dom";

export const EShippersPopup = ({ onClose }) => {
  const [shipmentData, setShipmentData] = useState(data);
  const token = useSelector((state) => state.eshipper.token);
  const { id } = useParams();

  const postShipmentData = async () => {
    const orderId = "8000000010946";
    onClose();
    try {
      const response = await axios.put(
        `https://uu2.eshipper.com/api/v2/ship`,
        shipmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Shipment Data Posted Successfully:", response.data);
    } catch (error) {
      console.error(
        "Error fetching shipment:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className={styles.popupContent}>
      <div className="dsdf">
        <h4 className="m-0 mb-2 fs-4">EShippers</h4>
        <div className={styles.eShipperPopup}>
          <div className={styles.items} onClick={postShipmentData}>
            Shipments
          </div>
          <div className={styles.items}>Shipment Events</div>
        </div>
      </div>
    </div>
  );
};
