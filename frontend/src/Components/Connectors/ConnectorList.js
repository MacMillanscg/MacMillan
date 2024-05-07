import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";
import styles from "./ConnectorList.module.css";
import amazonImg from "../../assets/images/amazon.png";

export const ConnectorList = () => {
  const { dashboardWidth } = useAppContext();

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className="connectorList">
        <div className={styles.connectorTop}>
          <Link to="#">Connectors</Link> /
          <span className={styles.titleText}>Amazon</span>
        </div>
        <div className={styles.connectorTitle}>
          <div className={styles.connectorImg}>
            <img src={amazonImg} alt="" />
          </div>
          <h1>Amazon</h1>
        </div>
        <div className={styles.connectorDetails}>
          <div className={styles.connectorLeft}></div>
          <div className={styles.connectorRight}></div>
        </div>
      </div>
    </div>
  );
};
