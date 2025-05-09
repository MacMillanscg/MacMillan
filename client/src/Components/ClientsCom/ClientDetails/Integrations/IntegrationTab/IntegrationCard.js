import React from "react";
import styles from "./IntegrationCard.module.css";
import { MaskedToken } from "../MaskedToken";

export const IntegrationCard = ({ id, integration }) => {
  console.log("key", id);
  return (
    // <div>
    <div className={styles.card}>
      <h3>{integration.platform}</h3>
      <h4 className="fs-5">{integration.integrationName}</h4>
      {integration.platform === "shopify" ? (
        <>
          <p>{integration.storeUrl}</p>
          {/* <p>{integration.apiKey}</p> */}
          <MaskedToken token={integration?.apiKey} />
        </>
      ) : (
        <>
          <p>{integration.eShipperStoreUrl}</p>
          <p>{integration.username}</p>
          <MaskedToken token={integration?.password} />
        </>
      )}
    </div>
    // </div>
  );
};
