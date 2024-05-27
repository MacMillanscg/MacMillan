import React from "react";
import connectionData from "../../Connections/ConnectionData";
import styles from "../../Connections/Connections.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const ConnectionsTab = () => {
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
            <Link
              to="/connections/addConnections"
              className={`btn btn-success ${styles.addBtn} ms-4`}
            >
              <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
              Add Connections
            </Link>
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
                      <li className={styles.listItem}>
                        {connection.status} --
                      </li>
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
                  <div className={styles.popup}>Test Connection</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
