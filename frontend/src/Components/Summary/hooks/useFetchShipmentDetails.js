import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchShipmentDetails = (url) => {
  const [shipmentData, setShipmentData] = useState([]);
  const [loadingShipments, setLoadingShipments] = useState(false);

  const fetchShipmentDetails = async () => {
    setLoadingShipments(true); // Start loading
    try {
      const response = await axios.get(`${url}/summary/getShipments`);
      console.log("response data", response.data);
      setShipmentData(response.data.shipments);
    } catch (error) {
      console.error("Error fetching shipment details:", error);
    } finally {
      setLoadingShipments(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchShipmentDetails();
  }, [url]);

  return { shipmentData, loadingShipments };
};

