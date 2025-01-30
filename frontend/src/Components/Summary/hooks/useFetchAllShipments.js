import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchAllShipments = (url) => {
  const [shipmentsResponse, setShipmentsResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShipmentsResponse = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/summary/getAllShipments`);
      setShipmentsResponse(response.data);
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

