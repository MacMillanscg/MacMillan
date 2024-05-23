import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import styles from "./AddClients.module.css";
import toast from "react-hot-toast";
import { url } from "../../api";
import axios from "axios";

export const AddClients = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [clientName, setClientName] = useState("");
  const { dashboardWidth } = useAppContext();

  const [selectedPlatform, setSelectedPlatform] = useState("");
  console.log("selectedPlateform", selectedPlatform);
  const [shopifyFields, setShopifyFields] = useState({
    storeUrl: "",
    apiKey: "",
  });
  const [woocommerceFields, setWooCommerceFields] = useState({
    storeUrl: "",
    consumerKey: "",
    consumerSecret: "",
  });
  const [magentoFields, setMagentoFields] = useState({
    storeUrl: "",
    accessToken: "",
    accessTokenSecret: "",
    consumerKey: "",
    consumerSecret: "",
  });
  const [oauthKeys, setOAuthKeys] = useState({
    oauthKey1: "",
    oauthKey2: "",
  });

  const handleOAuthKeyChange = (e) => {
    const { name, value } = e.target;
    setOAuthKeys((prevKeys) => ({ ...prevKeys, [name]: value }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePlatformChange = (e) => {
    const platform = e.target.value;
    setSelectedPlatform(platform);
  };

  const handleShopifyFieldChange = (e) => {
    const { name, value } = e.target;
    setShopifyFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const handleWooCommerceFieldChange = (e) => {
    const { name, value } = e.target;
    setWooCommerceFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const handleMagentoFieldChange = (e) => {
    const { name, value } = e.target;
    setMagentoFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const providedShopifyUrl = "27cd06-29.myshopify.com";
    const providedApiKey = "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";
    let errorOccurred = false;

    if (!clientName && !shopifyFields.storeUrl && !shopifyFields.apiKey) {
      toast.error("Please fill the form");
      errorOccurred = true;
    }
    if (!errorOccurred) {
      if (!clientName) {
        toast.error("Please enter client name");
        errorOccurred = true;
      }
    }

    // Check if entered Shopify URL and API key match the provided values
    if (
      shopifyFields.storeUrl !== providedShopifyUrl ||
      shopifyFields.apiKey !== providedApiKey
    ) {
      toast.error(
        "Invalid Shopify store URL or API key. Please check and try again."
      );
      return;
    }

    if (!clientName || !shopifyFields.storeUrl || !shopifyFields.apiKey) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const newClient = {
        clientName,
        shopifyStoreUrl: shopifyFields.storeUrl,
        shopifyApiKey: shopifyFields.apiKey,
      };

      const response = await axios.post(`${url}/clients/addclients`, newClient);

      console.log("New client created:", response.data);
      toast.success("New client created successfully!");
      closeModal();
    } catch (error) {
      console.error("Error creating new client:", error);
      toast.error("Error creating new client. Please try again.");
    }
  };

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.modalBackground}>
        <div className={styles.modalContainer}>
          <div className={styles.modalHeader}>
            <h2>Create New Client</h2>
            {/* <button onClick={closeModal}>Close</button> */}
          </div>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabButton} ${
                activeTab === "info" && styles.activeTab
              }`}
              onClick={() => handleTabChange("info")}
            >
              Info
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "connections" && styles.activeTab
              }`}
              onClick={() => handleTabChange("connections")}
            >
              Connections
            </button>
          </div>
          <div className={styles.tabContent}>
            {activeTab === "info" && (
              <>
                <div className={styles.tabPanel}>
                  <label htmlFor="clientName">Client Name:</label>
                  <div className="form-group mb-2">
                    <input
                      type="text"
                      className={`form-control ${styles.formControl}`}
                      id="exampleInputEmail"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.platformDropdown}>
                  <label htmlFor="platform">Select E-commerce Platform:</label>
                  <select
                    className="form-select mb-2"
                    id="platform"
                    value={selectedPlatform}
                    onChange={handlePlatformChange}
                  >
                    <option value="">Select Platform</option>
                    <option value="shopify">Shopify</option>
                    <option value="woocommerce">WooCommerce</option>
                    <option value="magento">Magento</option>
                  </select>
                </div>
                {/* Render platform-specific fields based on selected platform */}
                {selectedPlatform === "shopify" && (
                  <div className={styles.platformFields}>
                    <label htmlFor="shopifyStoreUrl">Shopify Store URL:</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      id="shopifyStoreUrl"
                      name="storeUrl"
                      value={shopifyFields.storeUrl}
                      onChange={handleShopifyFieldChange}
                    />
                    <label htmlFor="shopifyApiKey">Shopify API Key:</label>
                    <input
                      className="form-control"
                      type="text"
                      id="shopifyApiKey"
                      name="apiKey"
                      value={shopifyFields.apiKey}
                      onChange={handleShopifyFieldChange}
                    />
                  </div>
                )}
                {selectedPlatform === "woocommerce" && (
                  <div className={styles.platformFields}>
                    <label htmlFor="woocommerceStoreUrl">
                      WooCommerce Store URL:
                    </label>
                    <input
                      className="form-control mb-2"
                      type="text"
                      id="woocommerceStoreUrl"
                      name="storeUrl"
                      value={woocommerceFields.storeUrl}
                      onChange={handleWooCommerceFieldChange}
                    />
                    <label htmlFor="woocommerceConsumerKey">
                      WooCommerce Consumer Key:
                    </label>
                    <input
                      className="form-control mb-2"
                      type="text"
                      id="woocommerceConsumerKey"
                      name="consumerKey"
                      value={woocommerceFields.consumerKey}
                      onChange={handleWooCommerceFieldChange}
                    />
                    <label htmlFor="woocommerceConsumerSecret">
                      WooCommerce Consumer Secret:
                    </label>
                    <input
                      className="form-control mb-2"
                      type="text"
                      id="woocommerceConsumerSecret"
                      name="consumerSecret"
                      value={woocommerceFields.consumerSecret}
                      onChange={handleWooCommerceFieldChange}
                    />
                  </div>
                )}
                {selectedPlatform === "magento" && (
                  <div className={styles.platformFields}>
                    <label htmlFor="magentoStoreUrl">Magento Store URL:</label>
                    <input
                      className="form-control mb-2"
                      type="text"
                      id="magentoStoreUrl"
                      name="storeUrl"
                      value={magentoFields.storeUrl}
                      onChange={handleMagentoFieldChange}
                    />
                    <label htmlFor="magentoAccessToken">
                      Magento Access Token:
                    </label>
                    <input
                      className="form-control mb-2"
                      type="text"
                      id="magentoAccessToken"
                      name="accessToken"
                      value={magentoFields.accessToken}
                      onChange={handleMagentoFieldChange}
                    />
                    <label htmlFor="magentoAccessTokenSecret">
                      Magento Access Token Secret:
                    </label>
                    <input
                      className="form-control mb-2"
                      type="text"
                      id="magentoAccessTokenSecret"
                      name="accessTokenSecret"
                      value={magentoFields.accessTokenSecret}
                      onChange={handleMagentoFieldChange}
                    />
                    <label htmlFor="magentoConsumerKey">
                      Magento Consumer Key:
                    </label>
                    <input
                      className="form-control mb-2"
                      type="text"
                      id="magentoConsumerKey"
                      name="consumerKey"
                      value={magentoFields.consumerKey}
                      onChange={handleMagentoFieldChange}
                    />
                    <label htmlFor="magentoConsumerSecret">
                      Magento Consumer Secret:
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="magentoConsumerSecret"
                      name="consumerSecret"
                      value={magentoFields.consumerSecret}
                      onChange={handleMagentoFieldChange}
                    />
                  </div>
                )}
              </>
            )}
            {/* connection tab start here */}
            {activeTab === "connections" && (
              <div className={` ${styles.tabPanel} pt-3`}>
                <label htmlFor="oauthKey1">OAuth Key:</label>
                <input
                  className="form-control"
                  type="text"
                  id="oauthKey1"
                  name="oauthKey1"
                  value={oauthKeys.oauthKey1}
                  onChange={handleOAuthKeyChange}
                />
              </div>
            )}
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.cancelButton} onClick={closeModal}>
              Cancel
            </button>
            <button onClick={handleSubmit} className={styles.addButton}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
