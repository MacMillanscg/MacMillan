import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchUnFulfillmentOrders = (url, orders) => {
  const [fulfillmentOrders, setFulfillmentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUnFulfillmentOrders = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${url}/summary/get-fulfillment`);
      if (response && response.data.fulfillmentOrders) {
        setFulfillmentOrders(response.data.fulfillmentOrders);
      }
    } catch (error) {
      setError("Failed to fetch fulfillment orders.");
      console.log(
        "Error fetching fulfillment orders:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (orders && orders.length > 0) {
      getUnFulfillmentOrders();
    }
  }, [orders, url]);

  return { fulfillmentOrders, loading, error };
};

