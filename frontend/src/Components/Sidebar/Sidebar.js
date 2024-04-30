import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faLink,
  faUsers,
  faChevronLeft,
  faBars,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/logo.jpg";
import { useAppContext } from "../Context/AppContext";

export const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [showText, setShowText] = useState(true);
  // const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const { sidebarMinimized, setSidebarMinimized } = useAppContext();

  const handleItemClick = (link) => {
    setActiveLink(link);
  };

  const toggleSidebarWidth = () => {
    setSidebarMinimized(!sidebarMinimized);
  };

  const toggleTextVisibility = () => {
    setShowText(!showText);
    toggleSidebarWidth();
  };

  return (
    <div
      className={`${styles.sidebar} ${
        sidebarMinimized && styles["sidebar-minimized"]
      }`}
    >
      <div className={styles.headerlogo}>
        <div className="sidebar-logo" onClick={toggleTextVisibility}>
          <Link className={styles.sidebarLogo} to="/">
            <span className={styles.logoText}>
              {showText ? "MacMillan" : ""}
            </span>
          </Link>
          {showText ? (
            <>
              <FontAwesomeIcon
                icon={faChevronLeft}
                className={styles.logoicon}
              />
            </>
          ) : (
            <FontAwesomeIcon icon={faBars} className={styles.logoMenuIcon} />
          )}
        </div>
      </div>
      <ul className={styles.list}>
        <li
          className={`${styles.li} ${
            activeLink === "home" ? styles.active : ""
          }`}
        >
          <Link
            className={styles.sidebarLink}
            to="/"
            onClick={() => handleItemClick("home")}
          >
            {showText ? (
              <>
                <FontAwesomeIcon icon={faHome} className={styles.icon} />
                Home
              </>
            ) : (
              <FontAwesomeIcon icon={faHome} className={styles.icon} />
            )}
          </Link>
        </li>
        <hr className={styles.line} />
        <li
          className={`${styles.li} ${
            activeLink === "connections" ? styles.active : ""
          }`}
        >
          <Link
            className={styles.sidebarLink}
            to="/connections"
            onClick={() => handleItemClick("connections")}
          >
            {showText ? (
              <>
                <FontAwesomeIcon icon={faLink} className={styles.icon} />
                Connections
              </>
            ) : (
              <FontAwesomeIcon icon={faLink} className={styles.icon} />
            )}
          </Link>
        </li>
        <li
          className={`${styles.li} ${
            activeLink === "connectors" ? styles.active : ""
          }`}
        >
          <Link
            className={styles.sidebarLink}
            to="/connectors"
            onClick={() => handleItemClick("connectors")}
          >
            {showText ? (
              <>
                <FontAwesomeIcon icon={faUsers} className={styles.icon} />
                Connectors
              </>
            ) : (
              <FontAwesomeIcon icon={faUsers} className={styles.icon} />
            )}
          </Link>
        </li>
        <li
          className={`${styles.li} ${
            activeLink === "clients" ? styles.active : ""
          }`}
        >
          <Link
            className={styles.sidebarLink}
            to="/clients"
            onClick={() => handleItemClick("clients")}
          >
            {showText ? (
              <>
                <FontAwesomeIcon icon={faUserCircle} className={styles.icon} />
                Clients
              </>
            ) : (
              <FontAwesomeIcon icon={faUserCircle} className={styles.icon} />
            )}
          </Link>
        </li>
      </ul>
    </div>
  );
};
