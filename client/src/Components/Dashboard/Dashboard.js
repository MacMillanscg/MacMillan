import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";
import { url } from "../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faPlayCircle,
  faChevronRight,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import { useCustomFetch } from "../../customsHooks/useCustomFetch";
import { getUser } from "../../storageUtils/storageUtils";
import axios from "axios";

export const Dashboard = () => {
  const { dashboardWidth } = useAppContext();
  const user = getUser();

  // console.log("user1", user);
  const { data } = useCustomFetch(url, user._id);

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.home}>
        <div className={styles.homeTitle}>
          <h1 className={styles.heading1}>Welcome back {user && user.name}</h1>
          <p className={styles.description}>To do more with MacMillan</p>
          <Link to="#" className={styles.learnMore}>
            Learn more{" "}
            <FontAwesomeIcon
              icon={faChevronRight}
              className={styles.learnIcon}
            />
          </Link>
        </div>
        {/* right section here */}
        <div className={styles.homeRightBox}>
          <Link to="/alertmonitors">
            <div className={styles.card}>
              <div className={styles.zero}>0</div>
              <div className={styles.details}>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className={styles.icon}
                />
                <span className={styles.cardText}>
                  Uncleared alert monitors
                </span>
              </div>
            </div>
          </Link>

          <Link to="/deployedinstances">
            <div className={styles.card}>
              <div className={styles.zero}>0</div>
              <div className={styles.details}>
                <FontAwesomeIcon icon={faPlayCircle} className={styles.icon} />
                <span className={styles.cardText}>Deployed instances</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.homeBottom}>
        <div className={styles.bottomDetails}>
          <FontAwesomeIcon icon={faPlayCircle} className={styles.cardIcon} />
          <h2 className={styles.heading2}>Instance operations</h2>
        </div>
        <div className={styles.bottomDetails}>
          <FontAwesomeIcon icon={faBars} className={styles.cardIcon} />
          <h2 className={styles.heading2}>Activity feed</h2>
        </div>
      </div>
    </div>
  );
};
