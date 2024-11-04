import React, { useState, useEffect } from "react";
import connectionData from "../../../Connections/ConnectionData";
import styles from "../../../Connections/Connections.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../../../api";
import { ClipLoader } from "react-spinners";
import style from "./ConnectionsTab.module.css";

export const ConnectionsTab = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  console.log("connectionTabId", id);

  useEffect(() => {
    const getConnections = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${url}/connections`);
        setConnections(response.data);
      } catch (err) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };
    getConnections();
  }, []);

  // Filter connections by clientId
  const filteredConnections = connections?.filter(
    (connection) => connection.client.clientId === id
  );

  return (
    <>
      <div>
        <div className={styles.connectionHeader}>
          <h2 className={styles.heading2}>Connections</h2>
          <div className={styles.connectionsRight}>
            <div className="form-group me-4">
              <input
                type="text"
                className={`form-control ${styles.formControl}`}
                id="exampleInputEmail"
                placeholder="Search Connections"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
              />
              {/* <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} /> */}
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
              // to="/connections/addConnections"
              className={`btn btn-success ${styles.addBtn} ms-4`}
            >
              <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
              Add Connections
            </button>
          </div>
        </div>
        <div className={styles.cardSection}>
          {loading ? (
            <div className={style.loaderContainer}>
              <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
          ) : (
            filteredConnections.map((connection, index) => (
              <Link
                to={`/connections/connectionList`}
                className={styles.cardWrap}
                key={index}
              >
                <div className={`card ${styles.connectionCard}`}>
                  <div className="card-body">
                    <h3 className={styles.cardTitle}>
                      {connection.shopifyDetails?.shopifyTitle}
                    </h3>
                    <h4 className="fs-5 m-0 mb-2">
                      {connection.connectionName}
                    </h4>
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
                      </ul>
                    </div>
                    <div className={styles.popup}>Test Connection</div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
};
