import React from "react";
import { IntegrationCard } from "./IntegrationCard";
import styles from "./IntegrationList.module.css";

export const IntegrationList = ({ integrations }) => {
  // Filter integrations by platform
  const shopifyIntegrations = integrations.filter(
    (integration) => integration.platform === "shopify"
  );
  console.log("shopify", shopifyIntegrations);
  const otherIntegrations = integrations.filter(
    (integration) => integration.platform !== "shopify"
  );
  return (
    <div className="d-flex">
      <div className={styles.cardContainer}>
        {shopifyIntegrations.map((integration, i) => (
          <IntegrationCard
            key={integration._id}
            integration={integration}
            id={i}
          />
        ))}
      </div>
      <div className={styles.cardContainer}>
        {otherIntegrations.map((integration, i) => (
          <IntegrationCard
            key={integration._id}
            integration={integration}
            id={i}
          />
        ))}
      </div>
    </div>
  );
};
