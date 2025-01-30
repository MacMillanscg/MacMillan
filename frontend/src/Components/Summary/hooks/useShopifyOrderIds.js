import { useState, useEffect } from 'react';
import axios from 'axios';

export const useShopifyOrderIds = (fulfillmentOrders, url, id) => {
  const [shopifyOrderIds, setShopifyOrderIds] = useState([]);
  console.log("fulfillmentOrders in hook" , fulfillmentOrders)

  const fetchShopifyIds = async () => {
    try {
      const orderIds = fulfillmentOrders.map((order) => order.order_id); // Extract order IDs
      if (orderIds.length > 0) {
        setShopifyOrderIds(orderIds);
        console.log("orderIDs:", orderIds);
        await axios.post(`${url}/summary/api/saveOrderIds`, { orderIds });
      }
    } catch (error) {
      console.error("Error while saving order IDs:", error);
    }
  };

  useEffect(() => {
    if (fulfillmentOrders && fulfillmentOrders.length > 0) {
      fetchShopifyIds();
    }
  }, [fulfillmentOrders]);

  return shopifyOrderIds;
};

