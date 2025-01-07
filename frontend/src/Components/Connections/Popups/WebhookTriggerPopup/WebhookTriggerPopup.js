import React, { useState } from "react";
import styles from "./WebhookTriggerPopup.module.css";
import webhook from "../../../../assets/images/webhook.png";
import { useParams } from "react-router-dom";
import { url as urlAPI } from "../../../../api";
import axios from "axios";
import toast from "react-hot-toast";

export const WebhookTriggerPopup = ({ show, onClose }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  //   if (!show) return null;
  const { id } = useParams();
  console.log("webhook id", id);

  const handleSave = async (e) => {
    e.preventDefault();
    const urlPattern = /^http:\/\/.*\.com$/;
    if (!name || !url || !apiKey) {
      toast.error("All fields are required.");
      return;
    }
    if (!urlPattern.test(url)) {
      toast.error("URL must start with 'http://' and end with '.com'.");
      return;
    }
    try {
      const response = await axios.post(`${urlAPI}/connections/${id}`, {
        name,
        url,
        apiKey,
      });
      const { success, message } = response.data;
      if (success) {
        toast.success(message);
      }
      console.log("Server response:", response);
      onClose();
    } catch (error) {
      console.error("Error in sending connection:", error);
    }
  };

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
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="url">URL</label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="apiKey">API Key</label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <button className={styles.addBtn} onClick={handleSave}>
            Add
          </button>
        </form>
      </div>
    </div>
  );
};
