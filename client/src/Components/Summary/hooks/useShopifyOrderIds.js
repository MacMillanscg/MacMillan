import { useState, useEffect } from 'react';
import axios from 'axios';

export const useShopifyOrderIds = (currentOrders, fulfillmentOrders, url, id) => {
  const [shopifyOrderData, setShopifyOrderData] = useState([]); // Store both orderId and details

  console.log("fulfillmentOrders in hook", fulfillmentOrders);
  console.log("currentOrders in hook", currentOrders);

  const fetchShopifyIds = async () => {
    try {
      // Map currentOrders to extract necessary details and combine them with orderId
      const combinedOrderData = currentOrders.map((order) => {
        const orderId =  order.id.toString();
        const customer = order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : "Unknown";
        const address = order.shipping_address ? order.shipping_address.address1 : "No address";
        const platform = "Shopify"; 
        const createdDate = order.created_at;
        const clientName = order.clientName;

        return { 
          orderId, 
          customer, 
          address, 
          platform,
          createdDate, 
          clientName,
        };
      });

      // Set the combined data to the state
      setShopifyOrderData(combinedOrderData);
      console.log("Combined Order Data:", combinedOrderData);

      // Optionally send combined data to backend
      if (combinedOrderData.length > 0) {
        await axios.post(`${url}/summary/api/saveOrderIds`, { combinedOrderData });
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

  return shopifyOrderData; // Return the combined data array
};
