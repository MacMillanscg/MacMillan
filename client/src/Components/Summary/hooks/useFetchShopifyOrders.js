import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";

export const useFetchShopifyOrders = (connectionsData, url) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);
  const [orderClientsId, setOrderClientsId] = useState([]);
  const [allOrders, setAllOrders] = useState([]);

  const fetchShopifyOrders = async () => {
    setLoadingOrders(true); // Start loading
    try {
      // Ensure connectionsData is available
      if (!connectionsData || connectionsData.length === 0) {
        console.error("No connections available.");
        toast.error("No connections available.");
        setLoadingOrders(false);
        return;
      }

      const allOrders = [];
      const today = new Date();

      // Set 1st January of the current year as the start date
      const startOfYear = new Date(today.getFullYear(), 0, 1);

      const orderIds = new Set();

      for (const connection of connectionsData) {
        const id = connection._id;
        try {
          // Fetch orders from the backend
          const response = await axios.get(`${url}/summary/api/orders`);
          const orders = response.data.orders;
          setAllOrders(orders);
          setOrderClientsId(response.data.orderSummary);

          // Filter orders from 1st January to today
          const recentOrders = orders.filter((order) => {
            const orderDate = new Date(order.created_at);
            return orderDate >= startOfYear && orderDate <= today;
          });

          // Separate unfulfilled and fulfilled orders
          const unfulfilledOrders = recentOrders.filter(
            (order) => order.fulfillment_status !== "fulfilled"
          );

          const fulfilledOrders = recentOrders.filter(
            (order) => order.fulfillment_status === "fulfilled"
          );

          // Map orders to include phone number and remove duplicates
          const uniqueOrders = [...unfulfilledOrders, ...fulfilledOrders]
            .map((order) => {
              const phoneNumber = order.customer?.phone || "No phone provided";
              return { ...order, customerPhone: phoneNumber };
            })
            .filter((order) => {
              if (orderIds.has(order.id)) {
                return false; // Skip duplicate orders
              }
              orderIds.add(order.id); // Add order ID to the set
              return true;
            });

          // Add these orders to the overall list
          allOrders.push(...uniqueOrders);
        } catch (error) {
          console.error(`Error fetching orders for connection ID ${id}:`, error);
          toast.error(`Error fetching orders for connection ID ${id}.`);
        }
      }

      // Update state with all fetched unique orders
      setOrders(allOrders);
      setFilteredClients(allOrders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoadingOrders(false); // Stop loading
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShopifyOrders();
    }, 3000);

    return () => clearTimeout(timer);
  }, [connectionsData]);

  return { allOrders, orders, loadingOrders, filteredClients, orderClientsId };
};
