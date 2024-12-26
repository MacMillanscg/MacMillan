import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../../api";

export const Orders = () => {
  const [orders, setOrders] = useState([]);

  const showShopifyOrders = async () => {
    try {
      const response = await axios.get(`${url}/connections/api/orders`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="d-flex justify-end">
      <h1>Shopify Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>{order.name}</li>
        ))}
      </ul>
    </div>
  );
};
