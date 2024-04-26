import React from "react";
import styles from "./AlertMonitors.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const AlertMonitors = () => {
  return (
    <div className="dashboard">
      <div className={styles.alertMonitors}>
        <h1 className={styles.heading1}>Instance monitors</h1>
        <div className={styles.monitorRight}>
          <div className={`form-group ${styles.formGroup}`}>
            <span className={styles.search}>
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            </span>
            <input
              type="search"
              className="form-control"
              id="exampleInputEmail"
              placeholder="Search monitors"
            />
          </div>
          <button className={`btn btn-success ${styles.refreshBtn}`}>
            Refresh
          </button>
        </div>
      </div>
      <div className={styles.alertBottom}>
        <div className={styles.alertSection}>
          <h2 className={styles.heading2}>Alert monitors</h2>
          <p className={styles.para}>
            If an instance encounters an error (maybe a third-party API is
            down), you probably want to be alerted. You can configure monitoring
            and alerting rules to notify your team or even customers via text,
            email, or webhook when certain events occur.
          </p>
          <Link to="/">Learn about alert monitors</Link>
        </div>
      </div>
    </div>
  );
};
