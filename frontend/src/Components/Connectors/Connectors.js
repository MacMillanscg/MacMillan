import React from "react";
import styles from "./Connectors.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faPlus,
  faSearch,
  faSync,
  faThLarge,
  faClock,
  faVideo,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";
import connectorsData from "./ConnectorsData";
import amazonImg from "../../assets/images/amazon.png";

export const Connectors = () => {
  const { dashboardWidth } = useAppContext();

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.connectorHeader}>
        <h2 className={styles.heading2}>Connectors</h2>
        <div className={styles.connectorsRight}>
          <div className="form-group me-4">
            <input
              type="text"
              className={`form-control ${styles.formControl}`}
              id="exampleInputEmail"
              placeholder="Search connectors"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
            />
            {/* <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} /> */}
          </div>
          <div className={styles.selectFilterOption}>
            <select name="" id="" className={styles.selectFilter}>
              <option value="">Filter</option>
              <option value="">Connector1</option>
              <option value="">Connector2</option>
              <option value="">Connector3</option>
            </select>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={styles.filterIcon}
            />
          </div>
        </div>
      </div>
      <div className={styles.cardSection}>
        {connectorsData.map((connector, index) => (
          <Link
            to={`/connectors/connectorList`}
            className={styles.cardWrap}
            key={index}
          >
            <div className={`card ${styles.connectorCard}`}>
              <div className="card-body">
                <img src={amazonImg} className={styles.connectorImg} alt="" />
                <h3 className={styles.cardTitle}>{connector.title}</h3>
                <p className={styles.content}> {connector.content}</p>
                <div className="category">
                  <div className={styles.list}>
                    <div className={styles.listItem}>
                      <div className="listItemLeft">
                        <div className={styles.listItems}>
                          <Link to="#" className={styles.listText}>
                            <FontAwesomeIcon
                              className={styles.icon}
                              icon={connector.versionIcon}
                            />
                            Version
                          </Link>{" "}
                        </div>

                        <div className={styles.listItem}>
                          <span className={styles.versionCount}>0</span>
                          <Link to="#" className={styles.published}>
                            Published {connector.status}
                          </Link>
                        </div>
                      </div>
                      <div className="listItemRight">
                        <Link to="#" className={styles.listText}>
                          <FontAwesomeIcon
                            className={styles.icon}
                            icon={connector.categoryIcon}
                          />
                          Category
                        </Link>
                        <Link to="#" className={styles.category}>
                          {connector.category}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
