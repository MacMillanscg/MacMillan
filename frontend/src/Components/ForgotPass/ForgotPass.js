import React, { useState } from "react";
import styles from "./ForgotPass.module.css";

export const ForgotPass = () => {
  const [email, setEmail] = useState("");
  return (
    <div className="authenticate">
      <div className={styles.forgot}>
        <h3 className={styles.heading3}>Forgot Password</h3>
        <p>Please enter your email and reset you password.</p>
        <div className="form-group">
          <label>Your email*</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail"
            // placeholder="Email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="btn w-100 submit">Reset Password</button>
      </div>
    </div>
  );
};
