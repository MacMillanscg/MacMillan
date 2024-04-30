import React from "react";
import styles from "./ProfileResetPass.module.css";
import { Link } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";

export const ProfileResetPass = () => {
  const { dashboardWidth } = useAppContext();
  return (
    <div className="home-section" style={{ width: dashboardWidth }}>
      <div className={styles.profileDetails}>
        <div className={styles.profiletop}>
          <span className="me-2">Profile</span>/
          <span className={`ms-2 ${styles.profilename}`}>MacMillan</span>
          <div className={styles.inner}>
            <div className="inner-left">
              <span className={styles.subtitle}>MM</span>
              <span className={styles.title}>MacMillan</span>
            </div>
            <div className="inner-right">
              <button className={styles.cancel}>Cancel</button>
              <button className={`btn btn-success ${styles.save}`}>Save</button>
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
                // value={name}
                // onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputEmail"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group mb-2">
              <label>Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword"
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
