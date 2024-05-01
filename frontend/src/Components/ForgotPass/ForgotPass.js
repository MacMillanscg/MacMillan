import React, { useState } from "react";
import styles from "./ForgotPass.module.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/auth/forgot-password", { email })
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/login");
        } else {
          toast.dismiss();
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error("User does not exist", err);
      });
  };

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
        <button onClick={handleSubmit} className="btn w-100 submit">
          Reset Password
        </button>
      </div>
    </div>
  );
};
