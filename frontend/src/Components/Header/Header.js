import React, { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";
import { Profile } from "../Profile/Profile";
import { getUser } from "../../storageUtils/storageUtils";

export const Header = () => {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const profileRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const user = getUser();

  const toggleProfile = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsProfileVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.header}>
      <div className="py-1">
        <ul className={styles.list}>
          <li className={styles.item}>
            <button
              onClick={toggleProfile}
              className={`${styles.navlink} nav-link`}
              ref={toggleButtonRef}
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
      {isProfileVisible && (
        <div ref={profileRef}>
          <Profile />
        </div>
      )}
    </div>
  );
};
