import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { Profile } from "../Profile/Profile";

export const Header = () => {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("rememberMeUser"));

  const toggleProfile = () => {
    setIsProfileVisible(!isProfileVisible);
  };
  return (
    <div className={styles.header}>
      <div className="py-1">
        <ul className={styles.list}>
          <li className={styles.item}>
            <button
              onClick={toggleProfile}
              className={`${styles.navlink} nav-link`}
            >
              {user.name.slice(0, 2).toUpperCase()}
            </button>
          </li>
        </ul>
      </div>
      {isProfileVisible && <Profile />}
    </div>
  );
};
