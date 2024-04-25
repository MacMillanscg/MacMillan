import React from "react";
import styles from "./Profile.module.css";
import { Link } from "react-router-dom";

export const Profile = () => {
  return (
    <div className={styles.profile}>
      <div className={`${styles.card}`}>
        <img src="" alt="" />
        <div className="card-body">
          <div className={styles.cardtitle}>MM</div>
          <div className="title-text">testing@gmail.com</div>
          <Link className={styles.btn} to="/profiledetails">
            User setting
          </Link>

          <div className={styles.services}>
            <ul className="m-0 ps-3">
              <li className="mt-2">
                <Link className={styles.link} to="/support">
                  <i class="fa fa-cog" aria-hidden="true"></i> Contact Support
                </Link>
              </li>
              <li className="mt-2">
                <Link className={styles.link} to="#">
                  <i class="fa fa-sign-out" aria-hidden="true"></i> Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
