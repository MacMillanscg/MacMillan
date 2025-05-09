import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faHeadset,
  faLaptopHouse,
} from "@fortawesome/free-solid-svg-icons";
import { getUser } from "../../storageUtils/storageUtils";
import { useAppContext } from "../Context/AppContext";

export const Profile = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const { setSidebarMinimized } = useAppContext();

  const user = getUser();

  const userCapitalize =
    user?.name.charAt(0).toUpperCase() + user?.name.slice(1);

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    sessionStorage.removeItem("user");
    setSidebarMinimized(false);
    navigate("/login");
  };
  const openDialog = () => {
    setShowDialog(true);
    setShowProfile(false);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };
  const closeProfileModal = () => {
    setShowProfile(false);
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
                {user && user.name.slice(0, 2).toUpperCase()}
              </div>
              <div>{userCapitalize}</div>
              <div className="title-text"> {user && user.email}</div>
              <Link
                className={styles.btn}
                to={"/profiledetails"}
                onClick={closeProfileModal}
              >
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
