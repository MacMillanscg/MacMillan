import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { Link, resolvePath } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faHeadset } from "@fortawesome/free-solid-svg-icons";

export const Profile = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [showProfile, setShowProfile] = useState(true);

  const localStorageUser = JSON.parse(localStorage.getItem("rememberMeUser"));
  const sessionStorageUser = JSON.parse(sessionStorage.getItem("userRecord"));
  const user = localStorageUser || sessionStorageUser;
  const userCapitalize = user.name.charAt(0).toUpperCase() + user.name.slice(1);

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    sessionStorage.removeItem("user");
    navigate("/login");
  };
  const openDialog = () => {
    setShowDialog(true);
    setShowProfile(false);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const confirmLogout = () => {
    handleLogout();
  };

  return (
    <div>
      {showProfile && (
        <div className={styles.profile}>
          <div className={`${styles.card}`}>
            {/* <img src="" alt="" /> */}
            <div className="card-body">
              <div className={styles.cardtitle}>
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div>{userCapitalize}</div>
              <div className="title-text">{user.email}</div>
              <Link className={styles.btn} to={"/profiledetails"}>
                User setting
              </Link>

              <div className={styles.services}>
                <ul className="m-0 ps-3">
                  <li className="mt-2">
                    <Link className={styles.link} to="/support">
                      <FontAwesomeIcon
                        icon={faHeadset}
                        className={styles.supportIcon}
                      />{" "}
                      Contact Support
                    </Link>
                  </li>
                  <li className="mt-2">
                    <button onClick={openDialog} className={styles.logout}>
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className={styles.icon}
                      />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmationDialog
        open={showDialog}
        onClose={closeDialog}
        onConfirm={confirmLogout}
      />
    </div>
  );
};
