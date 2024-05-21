import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { Profile } from "../Profile/Profile";
import { url } from "../../api";
import { useCustomFetch } from "../../customsHooks/useCustomFetch";

export const Header = () => {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const navigate = useNavigate();
  const localStorageUser = JSON.parse(localStorage.getItem("rememberMeUser"));
  const sessionStorageUser = JSON.parse(sessionStorage.getItem("userRecord"));
  const user = localStorageUser || sessionStorageUser;
  const toggleProfile = () => {
    setIsProfileVisible(!isProfileVisible);
  };
  const { data } = useCustomFetch(url, user._id);

  return (
    <div className={styles.header}>
      <div className="py-1">
        <ul className={styles.list}>
          <li className={styles.item}>
            <button
              onClick={toggleProfile}
              className={`${styles.navlink} nav-link`}
            >
              {user.profileImage ? (
                <img
                  className={styles.profileImage00}
                  src={`http://localhost:5000/${user.profileImage.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt=""
                />
              ) : (
                user.name.slice(0, 2).toUpperCase()
              )}
            </button>
          </li>
        </ul>
      </div>
      {isProfileVisible && <Profile />}
    </div>
  );
};
