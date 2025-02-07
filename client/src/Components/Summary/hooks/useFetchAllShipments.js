import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchAllShipments = (url) => {
  const [shipmentsResponse, setShipmentsResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // These data are comming from database for shipements

  const fetchShipmentsResponse = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/summary/getAllShipments`);
      setShipmentsResponse(response.data);
      console.log("respnsedaat" , response.data)
    } catch (error) {
      setError("Failed to fetch shipments.");
      console.error("Error fetching shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipmentsResponse();
  }, [url]);

  return { shipmentsResponse, loading, error };
};

