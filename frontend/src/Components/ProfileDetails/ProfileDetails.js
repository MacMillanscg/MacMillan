import React from "react";
import styles from "./ProfileDetails.module.css";
import { Link } from "react-router-dom";

export const ProfileDetails = () => {
  return (
    <div className="home-section">
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
          <div className="form-section d-flex">
            <div className="left">
              <span className={styles.img}>MM</span>
            </div>
            <div className="avato ms-3">
              <Link className={styles.upload} to="/">
                Upload your Avator
              </Link>
              <p>
                Your avator makes it easier for team members to recognize
                accross MacMillan
              </p>
            </div>
          </div>
          <div className="inputFields">
            <div className="form-group mb-2">
              <label>Email</label>
              <input
                type="text"
                className="form-control"
                id="exampleInputFUllName"
                placeholder="Macmillan@gmail.com"
                // value={name}
                // onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <label>Name</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail"
                placeholder="Mac Millan"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <label>Role</label>
              <select class="form-select" aria-label="Default select example">
                <option selected>Owner</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div className="form-group mb-2">
              <label>Phone</label>
              <input
                type="text"
                className="form-control"
                id="exampleInputConfirm_Password"
                placeholder="+1"
                // value={confirmPassword}
                // onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
