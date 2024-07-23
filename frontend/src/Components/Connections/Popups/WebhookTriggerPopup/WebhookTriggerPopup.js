import React from "react";
import styles from "./WebhookTriggerPopup.module.css";
import webhook from "../../../../assets/images/webhook.png";

export const WebhookTriggerPopup = ({ show, onClose }) => {
  //   if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.close} onClick={onClose}>
          ×
        </button>
        <div className={styles.leftWebhook}>
          <div className={styles.webhookImage}>
            <img src={webhook} alt="Webhook" />
          </div>
          <div className={styles.webhookDetails}>
            <h2 className={styles.title}>Universal Webhook - Webhook</h2>
            <div className={styles.trigger}>Trigger</div>
          </div>
        </div>
        <div className={styles.configure}>Configure</div>

        <form className={styles.WebhookForm}>
          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" />
          </div>
          <div className={styles.field}>
            <label htmlFor="url">URL</label>
            <input type="text" id="url" />
          </div>
          <div className={styles.field}>
            <label htmlFor="apiKey">API Key</label>
            <input type="text" id="apiKey" />
          </div>
        </form>
      </div>
    </div>
  );
};
