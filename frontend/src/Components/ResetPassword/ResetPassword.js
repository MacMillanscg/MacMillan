import React, { useState } from "react";
import styles from "./ResetPassword.module.css";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");
  return (
    <div className="authenticate">
      <div className={styles.forgot}>
        <h3 className={styles.heading3}>Set a new password.</h3>
        <p>Please enter your new password.</p>
        <div className="form-group">
          <label>Password</label>
          <input
            type="pasword"
            className="form-control"
            id="exampleInputEmail"
            placeholder="Enter your new password"
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="pasword"
            className="form-control"
            id="exampleInputEmail"
            placeholder="Re-enter password"
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="btn w-100 submit">Update Password</button>
      </div>
    </div>
  );
};
