import React, { useState, useEffect } from "react";
import styles from "../../AddClients.module.css";
import toast from "react-hot-toast";
import axios from "axios";
import { url } from "../../../../api";

export const AddIntegration = ({ closeModal, clientId, setFetchTrigger }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [integrationName, setIntegrationName] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [shopifyFields, setShopifyFields] = useState({
    storeUrl: "",
    apiKey: "",
  });
  const [formData, setFormData] = useState({
    eShipperStoreUrl: "",
    username: "",
    password: "",
  });
  const [token, setToken] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  console.log("clientId", clientId);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setIsVerified(false);
  };

  const verifyEShipperCredentials = async () => {
    try {
      const { eShipperStoreUrl, username, password } = formData;
      // Make the POST request to your Express.js server
      const response = await axios.post(`${url}/clients/get-token`, {
        url: eShipperStoreUrl,
        principal: username,
        credential: password,
      });
      console.log(response);
      if (response.data.token) {
        toast.success("Credentials verified successfully!");
      }

      // Set the token in the state and mark as verified
      setToken(response.data.token);
      setIsVerified(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to authenticate. Please check your credentials.");
      setIsVerified(false);
    }
  };

  const addEShipperRecord = async () => {
    if (!isVerified) {
      toast.error("Please verify the  credentials before submitting.");
      return;
    }
    try {
      const eShipper = {
        integrationName,
        selectedPlatform,
        eShipperStoreUrl: formData.eShipperStoreUrl,
        username: formData.username,
        password: formData.password,
      };
      await axios.post(
        `${url}/clients/addclients/${clientId}/addEShipper`,
        eShipper
      );
      toast.success("New integration created successfully!");
      closeModal();

      // setFormData({
      //   eShipperStoreUrl: "",
      //   username: "",
      //   password: "",
      // });
      setIsVerified(false);
    } catch (err) {
      console.error(err);
    }
  };

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
    setIsVerified(false); // Reset verification status if fields change
  };

  const handleWooCommerceFieldChange = (e) => {
    const { name, value } = e.target;
    setWooCommerceFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const handleMagentoFieldChange = (e) => {
    const { name, value } = e.target;
    setMagentoFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const verifyShopifyCredentials = async () => {
    const { storeUrl, apiKey } = shopifyFields;

    try {
      const response = await axios.post(`${url}/clients/validate-shopify`, {
        storeUrl,
        apiKey,
      });

      if (response.status === 200) {
        toast.success("Shopify credentials verified successfully!");
        setIsVerified(true);
      }
    } catch (error) {
      console.error("Error verifying Shopify credentials:", error);
      toast.error(
        "Invalid Shopify store URL or API key. Please check and try again."
      );
      setIsVerified(false);
    }
  };

  const addShopifyRecord = async (e) => {
    // e.preventDefault();

    if (!isVerified) {
      toast.error("Please verify the Shopify credentials before submitting.");
      return;
    }

    try {
      const newClient = {
        integrationName,
        selectedPlatform,
        storeUrl: shopifyFields.storeUrl,
        apiKey: shopifyFields.apiKey,
      };
      console.log("newClinet", newClient);

      const response = await axios.post(
        `${url}/clients/addclients/${clientId}`,
        newClient
      );
      setFetchTrigger((prev) => !prev); // Toggle fetchTrigger to re-fetch clients

      console.log("New integration created:", response.data);
      toast.success("New integration created successfully!");
      closeModal();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating new integration:", error);
        toast.error("Error creating new integration. Please try again.");
      }
    }
  };

  // To manage all functions for submitting
  const handleSubmit = () => {
    if (selectedPlatform === "shopify") {
      addShopifyRecord();
    } else if (selectedPlatform === "eShipper") {
      addEShipperRecord();
    }
  };

  const handleNameKeyPress = (e) => {
    const char = String.fromCharCode(e.which);
    if (!/[a-zA-Z ]/.test(char)) {
      e.preventDefault();
    }
  };

  console.log("token", token);

  return (
    <div>
      <div className={styles.modalBackground}>
        <div className={styles.modalContainer} style={{ minHeight: "370px" }}>
          <div className={styles.modalHeader}>
            <h2>Create New Integration</h2>
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
              Key / Token
            </button>
          </div>
          <div className={styles.tabContent}>
            {activeTab === "info" && (
              <>
                <div className={styles.tabPanel}>
                  <label htmlFor="clientName">Integration Name:</label>
                  <div className="form-group mb-2">
                    <input
                      type="text"
                      className={`form-control ${styles.formControl}`}
                      id="name"
                      value={integrationName}
                      onChange={(e) => setIntegrationName(e.target.value)}
                      // onKeyPress={handleNameKeyPress}
                    />
                  </div>
                </div>
                <div className={styles.platformDropdown}>
                  <label htmlFor="platform">Select Platform:</label>
                  <select
                    className="form-select mb-2"
                    id="platform"
                    value={selectedPlatform}
                    onChange={handlePlatformChange}
                  >
                    <option value="">Select Platform</option>
                    <option value="shopify">Shopify</option>
                    <option value="eShipper">eShipper</option>
                    <option value="woocommerce">WooCommerce</option>
                    <option value="magento">Magento</option>
                  </select>
                </div>
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
                    <button
                      className="btn btn-primary mt-2"
                      onClick={verifyShopifyCredentials}
                      disabled={isVerified}
                    >
                      {isVerified ? "Verified" : "Verify Credentials"}
                    </button>
                  </div>
                )}
                {selectedPlatform === "eShipper" && (
                  <div className={styles.platformFields}>
                    <label htmlFor="shopifyStoreUrl">eShipper URL:</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      id="eShipperStoreUrl"
                      name="eShipperStoreUrl"
                      value={formData.eShipperStoreUrl}
                      onChange={handleChange}
                    />
                    <label htmlFor="shopifyApiKey">Username:</label>
                    <input
                      className="form-control"
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    <label htmlFor="shopifyApiKey">Password:</label>
                    <input
                      className="form-control"
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      className="btn btn-primary mt-2"
                      onClick={verifyEShipperCredentials}
                      disabled={isVerified}
                    >
                      {isVerified ? "Verified" : "Verify Credentials"}
                    </button>
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
            {activeTab === "connections" && (
              <div className={` ${styles.tabPanel} pt-3`}>
                <label htmlFor="oauthKey1">OAuth / Access Token Key:</label>
                <input
                  className="form-control"
                  type="text"
                  id="oauthKey1"
                  name="oauthKey1"
                  // value={oauthKeys.oauthKey1}
                  // onChange={handleOAuthKeyChange}
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
