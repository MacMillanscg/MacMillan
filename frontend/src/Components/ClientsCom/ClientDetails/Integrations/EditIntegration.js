import React, { useState, useEffect } from "react";
import styles from "../../AddClients.module.css";
import toast from "react-hot-toast";
import axios from "axios";
import { url } from "../../../../api";

export const EditIntegration = ({
  closeModal,
  clientId,
  setFetchTrigger,
  closeIntegration,
  selectedClient,
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const [integrationName, setIntegrationName] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [shopifyFields, setShopifyFields] = useState({
    storeUrl: "",
    apiKey: "",
  });
  const [isVerified, setIsVerified] = useState(false);

  console.log("clientId", clientId);

  useEffect(() => {
    if (selectedClient) {
      setIntegrationName(selectedClient.integrationName || "");
      setShopifyFields({
        storeUrl: selectedClient.storeUrl || "",
        apiKey: selectedClient.apiKey || "",
      });
    }
  }, [selectedClient]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleShopifyFieldChange = (e) => {
    const { name, value } = e.target;
    setShopifyFields((prevFields) => ({ ...prevFields, [name]: value }));
    setIsVerified(false); // Reset verification status if fields change
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      toast.error("Please verify the Shopify credentials before submitting.");
      return;
    }

    try {
      const updatedClient = {
        integrationName,
        storeUrl: shopifyFields.storeUrl,
        apiKey: shopifyFields.apiKey,
      };

      const response = await axios.post(
        `${url}/clients/addclients/editClient/${clientId}`,
        updatedClient
      );
      console.log("response in edit client", response);
      setFetchTrigger((prev) => !prev); // Toggle fetchTrigger to re-fetch clients

      toast.success("Client updated successfully!");
      closeIntegration();
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Error updating client. Please try again.");
    }
  };

  return (
    <div>
      <div className={styles.modalBackground}>
        <div className={styles.modalContainer} style={{ minHeight: "370px" }}>
          <div className={styles.modalHeader}>
            <h3>Update Integration</h3>
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
                  <label htmlFor="clientName">Integration Name:</label>
                  <div className="form-group mb-2">
                    <input
                      type="text"
                      className={`form-control ${styles.formControl}`}
                      id="name"
                      value={integrationName}
                      onChange={(e) => setIntegrationName(e.target.value)}
                    />
                  </div>
                </div>

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
                    {isVerified ? "Verified" : "Verify Shopify Credentials"}
                  </button>
                </div>
              </>
            )}
            {activeTab === "connections" && (
              <div className={` ${styles.tabPanel} pt-3`}>
                <label htmlFor="oauthKey1">OAuth Key:</label>
                <input
                  className="form-control"
                  type="text"
                  id="oauthKey1"
                  name="oauthKey1"
                />
              </div>
            )}
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.cancelButton} onClick={closeIntegration}>
              Cancel
            </button>
            <button onClick={handleSubmit} className={styles.addButton}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
