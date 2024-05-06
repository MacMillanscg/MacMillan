import React, { useState } from "react";
import styles from "./ResetPassword.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/images/logo.jpg";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfimPassword] = useState("");
  const navigate = useNavigate();
  const { id, token } = useParams();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }
    if (!/\d/.test(password)) {
      toast.error("Password must contain at least one number");
      return;
    }
    if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(password)) {
      toast.error("Password must contain at least one special character");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/auth/reset-password/${id}/${token}`,
        {
          password,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("something is went wrong");
    }
  };

  return (
    <div className="authenticate">
      <div className={styles.forgot}>
        <div className={styles.logo}>
          <img src={logo} alt="" />
        </div>
        <h3 className={styles.heading3}>Reset account password</h3>
        <p className={styles.para}>
          Enter a new password for the API Integration application
        </p>

        <div className={`form-group mt-4 mb-2 ${styles.formGroup}`}>
          <label className={styles.label}>Password:</label>
          <input
            type="password"
            className={`form-control ${styles.formControl}`}
            id="exampleInputEmail"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={`form-group ${styles.formGroup}`}>
          <label className={styles.label}>Confirm Password:</label>
          <input
            type="password"
            className={`form-control ${styles.formControl}`}
            id="exampleInputEmail"
            value={confirmPassword}
            onChange={(e) => setConfimPassword(e.target.value)}
          />
        </div>
        <button
          className={`btn submit  ${styles.resetBtn} mt-4`}
          onClick={handleSubmit}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};
