import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faLink,
  faUsers,
  faChevronLeft,
  faBars,
  faColumns,
  faCalendarAlt,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/logo.jpg";
import { useAppContext } from "../Context/AppContext";
import { getUser } from "../../storageUtils/storageUtils";
import { useCustomFetch } from "../../customsHooks/useCustomFetch";
import { url } from "../../api";

export const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [showText, setShowText] = useState(true);
  // const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const { sidebarMinimized, setSidebarMinimized } = useAppContext();
  const [isExploreExpanded, setIsExploreExpanded] = useState(false);
  let userId = getUser();
  userId = userId?._id;
  const { data, loading, error } = useCustomFetch(url, userId);

  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the role from localStorage or sessionStorage (after login)
    const userRole =
      JSON.parse(localStorage.getItem("rememberMe")) ||
      JSON.parse(sessionStorage.getItem("userRecord"));
    console.log("userRole", userRole);
    if (userRole) {
      setRole(userRole.role);
    } else {
      // Redirect to login if no role is found
      navigate("/login");
    }
  }, [navigate]);

  console.log("role", role);

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

  const toggleExploreDropdown = () => {
    if (!sidebarMinimized) {
      setIsExploreExpanded(!isExploreExpanded);
    }
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
        {role === "admin" && (
          <>
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
          </>
        )}

        <li
          className={`${styles.li} ${
            activeLink === "summary" ? styles.active : ""
          }`}
        >
          <Link
            className={styles.sidebarLink}
            to="/summary"
            onClick={() => handleItemClick("summary")}
          >
            {showText ? (
              <>
                <FontAwesomeIcon icon={faColumns} className={styles.icon} />
                Summary
              </>
            ) : (
              <FontAwesomeIcon icon={faColumns} className={styles.icon} />
            )}
          </Link>
        </li>
        {role === "admin" && (
          <>
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
                activeLink === "clients" ? styles.active : ""
              }`}
            >
              <Link
                className={styles.sidebarLink}
                to="/addclients"
                onClick={() => handleItemClick("clients")}
              >
                {showText ? (
                  <>
                    <FontAwesomeIcon icon={faUsers} className={styles.icon} />
                    Clients
                  </>
                ) : (
                  <FontAwesomeIcon icon={faUsers} className={styles.icon} />
                )}
              </Link>
            </li>
            <li
              className={`${styles.li} ${
                activeLink === "explore" ? styles.active : ""
              }`}
            >
              <div
                className={styles.sidebarLink}
                onClick={toggleExploreDropdown}
                style={{ cursor: "pointer" }}
              >
                {showText ? (
                  <>
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className={styles.icon}
                    />
                    Explore
                    <FontAwesomeIcon
                      icon={isExploreExpanded ? faCaretUp : faCaretDown}
                      className={styles.caretIcon}
                    />
                  </>
                ) : (
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className={styles.icon}
                  />
                )}
              </div>
              {isExploreExpanded && !sidebarMinimized && showText && (
                <ul className={styles.dropdown}>
                  <li>
                    <Link
                      className={styles.sidebarLink}
                      to="/explore/exploreconnections"
                      onClick={() => handleItemClick("exploreconnections")}
                    >
                      Connections
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.sidebarLink}
                      to="/explore/executions"
                      onClick={() => handleItemClick("executions")}
                    >
                      Executions
                    </Link>
                  </li>

                  <li>
                    <Link
                      className={styles.sidebarLink}
                      to="/explore/logs"
                      onClick={() => handleItemClick("logs")}
                    >
                      Logs
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.sidebarLink}
                      to="/explore/users"
                      onClick={() => handleItemClick("users")}
                    >
                      Users
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </>
        )}
      </ul>
    </div>
  );
};
