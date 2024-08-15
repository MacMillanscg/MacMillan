import React, { useState, useEffect, useRef } from "react";
import styles from "../../ClientsCom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AddIntegration } from "./AddIntegration";
import axios from "axios";
import { url } from "../../../../api";
import { MaskedToken } from "./MaskedToken";
import style from "./IntegrationTab.module.css";
import { EditIntegration } from "./EditIntegration";
import { IntegrationTabHeader } from "./IntegrationTabHeader";
import { TestConnectionPopUp } from "./TestConnectionPopUp";

export const IntegrationTab = ({
  clientId,
  isModalOpen,
  closeModal,
  openModal,
}) => {
  const [clients, setClients] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(false); // A state to trigger re-fetching
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [selectedClient, setSelectedClient] = useState(null);
  const [showIntegration, setShowIntegration] = useState(false);
  const [testPopUp, setTestPopUp] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const [responseData, setResponseData] = useState("");
  const [loading, setLoading] = useState(false);
  const popupRef = useRef();

  console.log("loading", loading);

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
        setLoading(false); // End loading
      }
    };
    fetchAllIntegration();
  }, [fetchTrigger]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const handleDotClick = (event, client) => {
    const rect = event.target.getBoundingClientRect();
    setPopupPosition({ top: rect.bottom, left: rect.right });
    setSelectedClient(client);
    setPopupVisible(true);
  };

  const handleEdit = () => {
    // Implement your edit functionality here
    setShowIntegration(true);
    setPopupVisible(false);
  };
  const closeIntegration = () => {
    setShowIntegration(false);
  };

  const handleDelete = () => {
    // Implement your delete functionality here
    setPopupVisible(false);
  };

  const handleTestPopUp = (index) => {
    setTestPopUp((prev) => ({
      // ...prev,
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
              className={`card  me-1 ${styles.cardSection} ${style.cardSection}`}
              key={i}
            >
              <div className="card-body">
                <div className={style.cardTop}>
                  <h3 className="card-title">{client.platform}</h3>
                  <div
                    className="cardDetails"
                    onClick={(e) => handleDotClick(e, client)}
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </div>
                </div>
                <h4>{client?.integrationName}</h4>
                <p className="mb-1">{client?.storeUrl}</p>
                <MaskedToken token={client?.apiKey} />
                <p className="mb-1 mt-0">{client.username}</p>
                <div className="mb-2">
                  <MaskedToken token={client?.password} />
                </div>

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
      {popupVisible && (
        <div
          className={style.popup}
          style={{ top: popupPosition.top, left: popupPosition.left }}
          ref={popupRef}
        >
          <button className="btn btn-success mb-1" onClick={handleEdit}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
      {showIntegration && (
        <EditIntegration closeIntegration={closeIntegration} />
      )}
    </>
  );
};
