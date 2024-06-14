import React, { useState, useEffect } from "react";
import styles from "./ProfileResetPass.module.css";
import { Link } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { url } from "../../api";
import { CancelPopUp } from "../ProfileDetails/CancelPopUp";

export const ProfileResetPass = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const { dashboardWidth } = useAppContext();
  const localStorageUser = JSON.parse(localStorage.getItem("rememberMeUser"));
  const sessionStorageUser = JSON.parse(sessionStorage.getItem("userRecord"));
  const user = localStorageUser || sessionStorageUser;
  const userCapitalize =
    userProfile?.name.charAt(0).toUpperCase() + userProfile?.name.slice(1);

  useEffect(() => {
    const fetchSingleProfile = async () => {
      try {
        const response = await axios.get(`${url}/auth/${user._id}`);
        const userData = response.data;
        setUserProfile(userData);
      } catch (error) {
        console.log("There was an error fetching the user data!", error);
      }
    };
    fetchSingleProfile();
  }, []);

  const userImageUrl = `http://localhost:5000/${userProfile?.profileImage}`;

  const handlePasswordChange = async () => {
    let errorOccurred = false;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please do not leave any required fields blank");
      errorOccurred = true;
    }

    if (!errorOccurred) {
      // Password strength validation

      if (currentPassword === newPassword) {
        toast.error("Current password should not be same as a new password.");
        errorOccurred = true;
      }

      if (newPassword !== confirmPassword) {
        toast.error("New Password & Confirm passwords do not match");
        errorOccurred = true;
      }

      if (newPassword.length < 8) {
        toast.error("Password must be at least 8 characters long");
        errorOccurred = true;
      } else if (!/[A-Z]/.test(newPassword)) {
        toast.error("Password must contain at least one uppercase letter");
        errorOccurred = true;
      } else if (!/\d/.test(newPassword)) {
        toast.error("Password must contain at least one number");
        errorOccurred = true;
      } else if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(newPassword)) {
        toast.error("Password must contain at least one special character");
        errorOccurred = true;
      }
    }

    if (errorOccurred) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/profileResetPass",
        {
          userId: user._id,
          currentPassword,
          newPassword,
        }
      );
      if (response.data.success) {
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      // toast.error("Please enter the passwords");
    }
  };
  const handleCancel = () => {
    if (
      currentPassword.length > 0 ||
      newPassword.length > 0 ||
      confirmPassword.length > 0
    ) {
      setShowDialog(true);
    }
  };

  return (
    <div className="home-section" style={{ width: dashboardWidth }}>
      <div className={styles.profileDetails}>
        <div className={styles.profiletop}>
          <span className="me-2">Profile</span>/
          <span className={`ms-2 ${styles.profilename}`}>{userCapitalize}</span>
          <div className={styles.inner}>
            <div className="inner-left">
              <span className={styles.subtitle}>
                {userProfile?.profileImage ? (
                  <img
                    className={styles.profileImage0}
                    src={userImageUrl}
                    alt=""
                  />
                ) : (
                  userProfile?.name.slice(0, 2).toUpperCase()
                )}
              </span>
              <span className={styles.title}>{userCapitalize}</span>
            </div>
            <div className="inner-right">
              <button className={styles.cancel} onClick={handleCancel}>
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className={`btn btn-success ${styles.save}`}
              >
                Save
              </button>
            </div>
          </div>
          <div className="more mb-3">
            <Link to="/profiledetails" className="me-3">
              Details
            </Link>
            <Link to="/profileResetPass">Password</Link>
          </div>
          {showDialog && (
            <CancelPopUp
              setShowDialog={setShowDialog}
              setCurrentPassword={setCurrentPassword}
              setNewPassword={setNewPassword}
              setConfirmPassword={setConfirmPassword}
            />
          )}
        </div>
        <div className={styles.profilebottom}>
          <div className="inputFields">
            <h3> Change Password</h3>
            <div className="form-group mb-2 position-relative">
              <label>Current Password</label>
              <input
                type={currentPasswordVisible ? "text" : "password"}
                className="form-control"
                id="exampleInputFUllName"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <span
                className={`position-absolute end-0 top-50 translate-middle-y ${styles.eyeIcon}`}
                onClick={() =>
                  setCurrentPasswordVisible(!currentPasswordVisible)
                } // Toggle password visibility on click
              >
                {currentPasswordVisible ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}{" "}
              </span>
            </div>
            <div className="form-group mb-2 position-relative">
              <label>New Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                className="form-control"
                id="exampleInputEmail"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                className={`position-absolute end-0 top-50 translate-middle-y ${styles.eyeIcon}`}
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility on click
              >
                {passwordVisible ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}{" "}
              </span>
            </div>

            <div className="form-group mb-2 position-relative">
              <label>Confirm New Password</label>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                className="form-control"
                id="exampleInputPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className={`position-absolute end-0 top-50 translate-middle-y ${styles.eyeIcon}`}
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                } // Toggle password visibility on click
              >
                {confirmPasswordVisible ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}{" "}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
