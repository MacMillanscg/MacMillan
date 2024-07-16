import React, { useState, useEffect } from "react";
import styles from "./Connections.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";
import { AddConnections } from "./AddConnections";
import { useSelector, useDispatch } from "react-redux";
import { fetchConnections } from "../../Redux/Actions/ConnectionsActions";

export const Connections = () => {
  const { dashboardWidth } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { connections, loading, error } = useSelector(
    (state) => state.connections
  );

  useEffect(() => {
    if (connections.length === 0) {
      dispatch(fetchConnections());
    }
  }, [dispatch]);

  console.log("connecitns", connections);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
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
            className={`btn btn-success ${styles.addBtn} ms-4`}
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
            Add Connection
          </button>
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
                  <h4 className="fs-5 m-0 mb-2">
                    {connection.client.clientName}
                  </h4>
                  <h4 className="fs-5 m-0 mb-2">{connection.connectionName}</h4>
                  <div className="category">
                    <ul className={styles.list}>
                      <li className={styles.listItem}>
                        <Link to="#" className={styles.listText}>
                          {/* <FontAwesomeIcon
                          className={styles.icon}
                          // icon={connection.versionIcon}
                        /> */}
                          Version
                        </Link>{" "}
                      </li>
                      {/* <li className={styles.listItem}>{connection.status} --</li> */}
                      <li className={styles.listItem}>
                        <Link to="#" className={styles.listText}>
                          {/* <FontAwesomeIcon
                          className={styles.icon}
                          // icon={connection.lastRunIcon}
                        /> */}
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

        {/* {loading && <h1>Loading ..... </h1>} */}
      </div>
      {isModalOpen && <AddConnections closeModal={closeModal} />}
    </div>
  );
};
