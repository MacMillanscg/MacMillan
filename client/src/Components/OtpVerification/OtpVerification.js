import React, { useState } from "react";
import styles from "./Otp.module.css";
import { Link } from "react-router-dom";

export const OtpVerification = () => {
  return (
    <div className="authenticate">
      <div className={styles.forgot}>
        <h3 className={styles.heading3}>Check your email</h3>
        <p className={styles.para}>
          We sent a reset link to yourEmail@gmail.com enter 6 digits code.
        </p>
        <div className="form-group d-flex">
          <input type="text" className="form-control me-2" />
          <input type="text" className="form-control me-2" />
          <input type="text" className="form-control me-2" />
          <input type="text" className="form-control me-2" />
          <input type="text" className="form-control me-2" />
          <input type="text" className="form-control me-2" />
        </div>
        <button className={`w-100 btn ${styles.btn}`}>Verifty code</button>
        <p>
          Haven't got the email <Link to="/">Resend</Link>
        </p>
      </div>
    </div>
  );
};
