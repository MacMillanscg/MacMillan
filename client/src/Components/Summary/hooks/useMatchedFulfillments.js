import { useState, useEffect } from "react";

export const useMatchedFulfillments = (fulfillmentOrders, allShipmentData) => {
  const [matchedFulfillments, setMatchedFulfillments] = useState([]);

  const matchFulfillmentWithShipments = () => {
    const shipmentMap = new Map(
      allShipmentData.map((shipment) => [shipment.shopifyOrderId, shipment])
    );

    const matched = fulfillmentOrders
      .map((fulfillment) => {
        const matchingShipment = shipmentMap.get(fulfillment.order_id.toString());
        if (matchingShipment) {
          return {
            fulfillment_order_id: fulfillment.id,
            tracking_info: {
              number: matchingShipment.trackingNumber,
              url: matchingShipment.trackingUrl,
            },
          };
        }
        return null;
      })
      .filter(Boolean);

    setMatchedFulfillments(matched);
  };

  useEffect(() => {
    if (fulfillmentOrders.length > 0 && allShipmentData.length > 0) {
      matchFulfillmentWithShipments();
    }
  }, [fulfillmentOrders, allShipmentData]);

  return { matchedFulfillments };
};
