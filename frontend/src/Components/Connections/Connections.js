import React, { useState, useEffect } from "react";
import styles from "./Connections.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faPlus,
  faEllipsisV,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";
import { AddConnections } from "./AddConnections";
import { useSelector, useDispatch } from "react-redux";
import { fetchConnections } from "../../Redux/Actions/ConnectionsActions";
import { WarningPopup } from "./Popups/WarningPopup/WarningPopup";
import axios from "axios";
import { url } from "../../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { decodedData } from "./DecodedData";

export const Connections = () => {
  const { dashboardWidth } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [connectionId, setConnectionId] = useState(null);
  const [message, setMessage] = useState("");
  const [base64Data, setbBase64Data] = useState(decodedData);
  const dispatch = useDispatch();
  const { connections, loading, error } = useSelector(
    (state) => state.connections
  );

  const handleDecode = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/connections/decode-pdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: base64Data }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error("Error decoding PDF:", error);
      setMessage("Failed to decode PDF.");
    }
  };

  const navigate = useNavigate();

  const handleEditConnection = (id) => {
    navigate(`/connections/${id}`);
  };

  useEffect(() => {
    dispatch(fetchConnections());
  }, [dispatch]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteConnection = (id) => {
    setConnectionId(id);
    setShowWarningModal(true);
  };
  console.log("delete id", connectionId);

  const confirmDeleteConnection = async () => {
    try {
      await axios.delete(`${url}/connections/${connectionId}`);
      dispatch(fetchConnections());
      setShowWarningModal(false);
      toast.success("The connection deleted successfully.");
    } catch (error) {
      console.error("Error deleting Shopify details:", error);
    }
  };

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.connectionHeader}>
        <h2 className={styles.heading2}>Connections</h2>
        <WarningPopup
          show={showWarningModal}
          onClose={() => setShowWarningModal(false)}
          onConfirm={confirmDeleteConnection} // Confirm delete on this action
        />{" "}
        <div className={styles.connectionsRight}>
          <div className="form-group me-4">
            <input
              type="text"
              className={`form-control ${styles.formControl}`}
              id="exampleInputEmail"
              placeholder="Search Connections"
            />
          </div>
          <div className={styles.selectFilterOption}>
            <select name="" id="" className={styles.selectFilter}>
              <option value="">Filter</option>
              <option value="">Connection2</option>
              <option value="">Connection3</option>
              <option value="">Connection4</option>
            </select>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={styles.filterIcon}
            />
          </div>
          <button
            className={`btn btn-success ${styles.addBtn} ms-4`}
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
            Add Connection
          </button>
          <button onClick={handleDecode}>Decode PDF</button>
          <p>{message}</p>
        </div>
      </div>
      <div className={styles.cardSection}>
        {connections &&
          connections.map((connection, index) => (
            <Link to="#" className={styles.cardWrap} key={index}>
              <div className={`card ${styles.connectionCard}`}>
                <div className="card-body">
                  <h3 className={styles.cardTitle}>
                    {connection?.shopifyDetails?.shopifyTitle}
                  </h3>
                  <div className={styles.EditDeleteShow}>
                    <FontAwesomeIcon
                      icon={faEllipsisV}
                      className={styles.dots}
                    />
                    <div className={styles.editDelteIconsWrap}>
                      <Link to={`/connections/${connection._id}`}>
                        <FontAwesomeIcon
                          icon={faPencil}
                          className={styles.editIcon}
                        />
                      </Link>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className={styles.deleteIcon}
                        onClick={() => handleDeleteConnection(connection._id)} // Pass connection._id here
                      />
                    </div>
                  </div>
                  <h4 className="fs-5 m-0 mb-2">
                    {connection.client.clientName}
                  </h4>
                  <h4 className="fs-5 m-0 mb-2">{connection.connectionName}</h4>
                  <div className="category">
                    <ul className={styles.list}>
                      <li className={styles.listItem}>
                        <Link to="#" className={styles.listText}>
                          Version
                        </Link>{" "}
                      </li>

                      <li className={styles.listItem}>
                        <Link to="#" className={styles.listText}>
                          Last Run
                        </Link>{" "}
                      </li>
                      <li className={styles.listItem}>
                        <span>Has not run</span>{" "}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
      {isModalOpen && <AddConnections closeModal={closeModal} />}
    </div>
  );
};
