import React from "react";
import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faLink,
  faUsers,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/logo.jpg";

export const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.headerlogo}>
        <div className="sidebar-logo">
          <Link className={styles.sidebarLogo} to="/">
            MacMillan
            <FontAwesomeIcon icon={faChevronLeft} className={styles.logoicon} />
          </Link>
        </div>
      </div>
      <ul className={styles.list}>
        <li className={styles.li}>
          <Link className={styles.sidebarLink} to="/">
            <FontAwesomeIcon icon={faHome} className={styles.icon} />
            Home
          </Link>
        </li>
        <li className={styles.li}>
          <Link className={styles.sidebarLink} to="/connections">
            <FontAwesomeIcon icon={faLink} className={styles.icon} />
            Connections
          </Link>
        </li>
        <li className={styles.li}>
          <Link className={styles.sidebarLink} to="/connectors">
            <FontAwesomeIcon icon={faUsers} className={styles.icon} />
            Connectors
          </Link>
        </li>
        <li className={styles.li}>
          <Link className={styles.sidebarLink} to="/clients">
            <FontAwesomeIcon icon={faUsers} className={styles.icon} />
            Clients
          </Link>
        </li>
      </ul>
    </div>
  );
};
