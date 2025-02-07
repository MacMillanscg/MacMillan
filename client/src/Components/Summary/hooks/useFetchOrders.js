import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchOrders = (url) => {
  const [databaseOrders, setDatabaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   To get orders from database then use this hook.

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${url}/summary/latestOrders`);
        setDatabaseOrders(response.data);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { databaseOrders, loading, error };
};

