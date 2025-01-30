import React, { useState } from "react";
import styles from "./ResetPassword.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/images/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { url } from "../../api";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfimPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
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
        `${url}/auth/reset-password/${id}/${token}`,
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

        <div
          className={`form-group mt-4 mb-2 position-relative ${styles.formGroup}`}
        >
          <label className={styles.label}>Password:</label>
          <input
            type={passwordVisible ? "text" : "password"}
            className={`form-control ${styles.formControl}`}
            id="exampleInputEmail"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <span
            className={`position-absolute end-0 top-50 ${styles.eyeIcon}`}
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? (
              <FontAwesomeIcon icon={faEye} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} />
            )}{" "}
          </span>
        </div>
        <div className={`form-group position-relative ${styles.formGroup}`}>
          <label className={styles.label}>Confirm Password:</label>
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            className={`form-control ${styles.formControl}`}
            id="exampleInputEmail"
            value={confirmPassword}
            onChange={(e) => setConfimPassword(e.target.value)}
          />
          <span
            className={`position-absolute end-0 top-50 ${styles.eyeIcon}`}
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            {confirmPasswordVisible ? (
              <FontAwesomeIcon icon={faEye} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} />
            )}{" "}
          </span>
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
