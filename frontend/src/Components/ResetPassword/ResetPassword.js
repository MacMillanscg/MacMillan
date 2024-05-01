import React, { useState } from "react";
import styles from "./ResetPassword.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

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
        <h3 className={styles.heading3}>Set a new password.</h3>
        <p>Please enter your new password.</p>

        <div className="form-group">
          <label>New Password*</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputEmail"
            placeholder="Re-enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password*</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputEmail"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfimPassword(e.target.value)}
          />
        </div>
        <button className="btn w-100 submit" onClick={handleSubmit}>
          Update Password
        </button>
      </div>
    </div>
  );
};
