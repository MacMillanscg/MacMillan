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
  const popupRef = useRef();

  console.log("clients", clients);

  useEffect(() => {
    const fetchAllIntegration = async () => {
      try {
        const response = await axios.get(`${url}/clients/${clientId}`);
        if (response) {
          setClients(response?.data.integrations);
        }
        console.log("resintegr", response.data.integrations);
      } catch (error) {
        console.log(error);
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

  return (
    <>
      <IntegrationTabHeader openModal={openModal} />
      <div className={styles.cardSection}>
        {clients?.map((client, i) => {
          return (
            <div className="card me-1" style={{ width: "32%" }} key={i}>
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
                <p className="mb-1">{client?.apiKey}</p>
                <MaskedToken token={client?.storeUrl} />
                <div className={style.testConnection}>Test Connection</div>
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
