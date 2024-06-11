import React, { useState } from "react";
import styles from "./Connections.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";
import connectionData from "./ConnectionData";
import { AddConnections } from "./AddConnections";

export const Connections = () => {
  const { dashboardWidth } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        {connectionData.map((connection, index) => (
          <Link
            to={`/connections/connectionList`}
            className={styles.cardWrap}
            key={index}
          >
            <div className={`card ${styles.connectionCard}`}>
              <div className="card-body">
                <h3 className={styles.cardTitle}>{connection.title}</h3>
                <div className="category">
                  <ul className={styles.list}>
                    <li className={styles.listItem}>
                      <Link to="#" className={styles.listText}>
                        <FontAwesomeIcon
                          className={styles.icon}
                          icon={connection.versionIcon}
                        />
                        Version
                      </Link>{" "}
                      <Link to="#" className={styles.listText}>
                        <FontAwesomeIcon
                          className={styles.icon}
                          icon={connection.categoryIcon}
                        />
                        Category
                      </Link>
                    </li>
                    <li className={styles.listItem}>{connection.status} --</li>
                    <li className={styles.listItem}>
                      <Link to="#" className={styles.listText}>
                        <FontAwesomeIcon
                          className={styles.icon}
                          icon={connection.lastRunIcon}
                        />
                        Last Run
                      </Link>{" "}
                      <Link className={styles.listText} to="#">
                        <FontAwesomeIcon
                          className={styles.icon}
                          icon={connection.instanceIcon}
                        />
                        Instance
                      </Link>
                    </li>
                    <li className={styles.listItem}>
                      <span>Has not run</span>{" "}
                      <span>{connection.instances} instances</span>
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
