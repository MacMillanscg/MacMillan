import React, { useState } from "react";
import styles from "./ProfileResetPass.module.css";
import { Link } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

export const ProfileResetPass = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { dashboardWidth, name } = useAppContext();
  const localStorageUser = JSON.parse(localStorage.getItem("rememberMeUser"));
  const sessionStorageUser = JSON.parse(sessionStorage.getItem("userRecord"));
  const user = localStorageUser || sessionStorageUser;
  const userCapitalize = user.name.charAt(0).toUpperCase() + user.name.slice(1);

  const handlePasswordChange = async () => {
    let errorOccurred = false;
    if (!currentPassword.trim()) {
      toast.error("Please enter a password");
      errorOccurred = true;
    }
    if (!newPassword.trim()) {
      toast.error("Please enter a new password");
      errorOccurred = true;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      errorOccurred = true;
    }

    if (!errorOccurred) {
      // Password strength validation
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
      console.log("resetReponse", response);
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

  return (
    <div className="home-section" style={{ width: dashboardWidth }}>
      <div className={styles.profileDetails}>
        <div className={styles.profiletop}>
          <span className="me-2">Profile</span>/
          <span className={`ms-2 ${styles.profilename}`}>{userCapitalize}</span>
          <div className={styles.inner}>
            <div className="inner-left">
              <span className={styles.subtitle}>
                {user.profileImage ? (
                  <img
                    className={styles.profileImage0}
                    src={`http://localhost:5000/${user.profileImage.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt=""
                  />
                ) : (
                  user.name.slice(0, 2).toUpperCase()
                )}
              </span>
              <span className={styles.title}>{userCapitalize}</span>
            </div>
            <div className="inner-right">
              <button className={styles.cancel}>Cancel</button>
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
        </div>
        <div className={styles.profilebottom}>
          <div className="inputFields">
            <h3> Change Password</h3>
            <div className="form-group mb-2">
              <label>Current Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputFUllName"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputEmail"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group mb-2">
              <label>Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
