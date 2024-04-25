import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { Profile } from "../Profile/Profile";

export const Header = () => {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const navigate = useNavigate();

  const toggleProfile = () => {
    setIsProfileVisible(!isProfileVisible);
  };
  return (
    <div className="header-section">
      <div className="bg-light py-1">
        <ul className={styles.list}>
          <li className={styles.item}>
            <button
              onClick={toggleProfile}
              className={`${styles.navlink} nav-link`}
            >
              MM
            </button>
          </li>
        </ul>
      </div>
      {isProfileVisible && <Profile />}
    </div>
  );
};
