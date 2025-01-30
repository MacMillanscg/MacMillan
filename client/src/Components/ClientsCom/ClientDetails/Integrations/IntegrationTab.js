import React, { useState, useEffect, useRef } from "react";
import styles from "../../ClientsCom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faPencilAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { AddIntegration } from "./AddIntegration";
import axios from "axios";
import { url } from "../../../../api";
import { MaskedToken } from "./MaskedToken";
import style from "./IntegrationTab.module.css";
import { EditIntegration } from "./EditIntegration";
import { IntegrationTabHeader } from "./IntegrationTabHeader";
import { TestConnectionPopUp } from "./TestConnectionPopUp";
import { ConfirmCancelPopUp } from "../../../Common/ConfirmCancelPopUp/ConfirmCancelPopUp";

export const IntegrationTab = ({
  clientId,
  isModalOpen,
  closeModal,
  openModal,
}) => {
  const [clients, setClients] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showIntegration, setShowIntegration] = useState(false);
  const [testPopUp, setTestPopUp] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const [responseData, setResponseData] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchAllIntegration = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/clients/${clientId}`);
        if (response) {
          setClients(response?.data.integrations);
          setResponseData(response);
        }
        console.log("resintegr", response);
      } catch (error) {
        setErrorResponse(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllIntegration();
  }, [fetchTrigger]);

  const handleEdit = () => {
    setShowIntegration(true);
  };

  const closeIntegration = () => {
    setShowIntegration(false);
  };

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const onConfirmDelete = async () => {
    setConfirmDelete(false);
    try {
      await axios.delete(
        `${url}/clients/addclients/${clientId}/integrations/${selectedClient._id}`
      );
      setFetchTrigger((prev) => !prev);
    } catch (error) {
      console.error("Failed to delete the integration:", error);
    }
  };

  const handleTestPopUp = (index) => {
    setTestPopUp((prev) => ({
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (testPopUp) {
      const timeout = setTimeout(() => {
        setTestPopUp(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [testPopUp]);

  return (
    <>
      <IntegrationTabHeader openModal={openModal} />
      <div className={styles.cardSection}>
        {clients?.map((client, i) => {
          return (
            <div
              className={`card me-1 ${styles.cardSection} ${style.cardSection}`}
              key={i}
            >
              <div className="card-body pb-5">
                <div className={style.cardTop}>
                  <h3 className="card-title">{client.platform}</h3>
                  <div
                    className={`${style.cardDetails} cardDetails`}
                    onMouseEnter={() => setSelectedClient(client)}
                    onMouseLeave={() => setSelectedClient(null)}
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />

                    {/* Popup menu that shows on hover */}
                    {selectedClient === client && (
                      <div className={style.popup}>
                        <button
                          className={`${styles.editIcon}`}
                          onClick={handleEdit}
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                        <button
                          className={`${styles.deleteIcon}`}
                          onClick={handleDelete}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h4>{client?.integrationName}</h4>
                <p className="mb-1">{client?.storeUrl}</p>
                <p>{client?.eShipperStoreUrl}</p>
                <MaskedToken
                  token={client?.apiKey}
                  style={{ marginBottom: "20px" }}
                />
                <p className="mb-1 mt-0">{client.username}</p>
                <MaskedToken token={client?.password} />

                <div
                  className={style.testConnection}
                  onClick={() => handleTestPopUp(i)}
                >
                  Test Connection
                </div>
                {testPopUp[i] && (
                  <TestConnectionPopUp
                    onClose={() => handleTestPopUp(i)}
                    responseData={responseData}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <AddIntegration
          closeModal={closeModal}
          clientId={clientId}
          setFetchTrigger={setFetchTrigger}
          openModal={openModal}
        />
      )}

      {showIntegration && (
        <EditIntegration
          clientId={clientId}
          setFetchTrigger={setFetchTrigger}
          closeIntegration={closeIntegration}
          selectedClient={selectedClient}
        />
      )}

      {confirmDelete && (
        <ConfirmCancelPopUp
          headerText="Warning"
          bodyText="Are you sure you want to delete this record?"
          onOk={onConfirmDelete}
          onCancel={() => setConfirmDelete(false)}
          okButtonText="Delete"
          cancelButtonText="Cancel"
        />
      )}
    </>
  );
};
