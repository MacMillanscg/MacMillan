import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/images/logo.jpg";
import styles from "./Register.module.css";
import { Terms } from "./Terms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { url } from "../../api";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showTerms, setShowTerms] = useState(false); // State to toggle visibility of terms and conditions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setAgreedToTerms(!agreedToTerms);
  };
  console.log("agreedTerms", agreedToTerms);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[$&+,:;=?@#|'<>.^*()%!-]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength) => {
    if (strength === 0) {
      return "Very Weak";
    } else if (strength === 1 || strength === 2) {
      return "Weak";
    } else if (strength === 3) {
      return "Medium";
    } else {
      return "Strong";
    }
  };

  const registerUser = async () => {
    if (!agreedToTerms) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }
    // Validation checks
    let errorOccurred = false;
    if (!name.trim()) {
      toast.error("Please enter your name");
      errorOccurred = true;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      errorOccurred = true;
    }
    if (!password.trim()) {
      toast.error("Please enter a password");
      errorOccurred = true;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      errorOccurred = true;
    }

    // Perform password strength validation only if the basic validation checks pass
    if (!errorOccurred) {
      // Password strength validation
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        errorOccurred = true;
      } else if (!/[A-Z]/.test(password)) {
        toast.error("Password must contain at least one uppercase letter");
        errorOccurred = true;
      } else if (!/\d/.test(password)) {
        toast.error("Password must contain at least one number");
        errorOccurred = true;
      } else if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(password)) {
        toast.error("Password must contain at least one special character");
        errorOccurred = true;
      }
    }

    if (errorOccurred) {
      // If any error occurred during validation, return without registering the user
      return;
    }

    const userObj = {
      name,
      email,
      password,
      confirmPassword,
    };
    try {
      toast.loading("Loading");
      const response = await axios.post(`${url}/auth/register`, userObj);
      console.log("register", response);
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("something went wrong");
    }
  };

  // Password validation messages and styles
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialCharacter = /[$&+,:;=?@#|'<>.^*()%!-]/.test(password);
  const isLengthValid = password.length >= 8;

  const upperCaseMessage = hasUpperCase
    ? "✔️ At least one uppercase"
    : "❌ At least one uppercase";
  const numberMessage = hasNumber
    ? "✔️ At least one number"
    : "❌ At least one number";
  const specialCharacterMessage = hasSpecialCharacter
    ? "✔️ At least one special character"
    : "❌ At least one special character";
  const lengthMessage = isLengthValid
    ? "✔️ Password must be 8 characters long"
    : "❌ Password must be 8 characters long";

  // Function to restrict non-alphabetic characters in name input field
  const handleNameKeyPress = (e) => {
    const char = String.fromCharCode(e.which);
    if (!/[a-zA-Z ]/.test(char)) {
      e.preventDefault();
    }
  };

  return (
    <div className="authenticate">
      <div className={styles.signUp}>
        <div className={styles.logo}>
          <img src={logo} alt="Macmallin logo" />
        </div>
        <h3 className={`text-center ${styles.heading3}`}>MacMillan</h3>

        <div className="inputFields">
          <div className="form-group">
            <input
              type="text"
              className={`form-control ${styles.formControl}`}
              id="exampleInputFUllName"
              placeholder="Full Name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleNameKeyPress} // Attach the onKeyPress handler to restrict input
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className={`form-control ${styles.formControl}`}
              id="exampleInputEmail"
              placeholder="Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group position-relative">
            <input
              type={passwordVisible ? "text" : "password"}
              className={`form-control ${styles.formControl}`}
              id="exampleInputPassword"
              placeholder="Password*"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordStrength(calculatePasswordStrength(e.target.value));
              }}
            />
            <span
              className={`position-absolute end-0 top-50 translate-middle-y ${styles.eyeIcon}`}
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}{" "}
            </span>
            {password.length > 4 ? (
              <div className={`progress mb-2 ${styles.progressBar}`}>
                <div
                  className={`progress-bar ${
                    passwordStrength >= 4
                      ? "bg-success"
                      : passwordStrength === 3
                      ? "bg-warning"
                      : "bg-danger"
                  }`}
                  role="progressbar"
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  aria-valuenow={passwordStrength}
                  aria-valuemin="0"
                  aria-valuemax="4"
                ></div>
              </div>
            ) : null}
            {password.length > 1 ? (
              <div
                className={`password-validation ${styles.passwordValidation}`}
              >
                <p className={hasUpperCase ? styles.valid : styles.invalid}>
                  {upperCaseMessage}
                </p>
                <p className={hasNumber ? styles.valid : styles.invalid}>
                  {numberMessage}
                </p>
                <p
                  className={
                    hasSpecialCharacter ? styles.valid : styles.invalid
                  }
                >
                  {specialCharacterMessage}
                </p>
                <p className={isLengthValid ? styles.valid : styles.invalid}>
                  {lengthMessage}
                </p>
              </div>
            ) : null}
          </div>
          <div
            className={`password-strength-feedback mt-2 mb-2 ${
              passwordStrength === 3 ? styles.mediumStrength : ""
            }`}
          >
            {password.length > 4
              ? getPasswordStrengthLabel(passwordStrength)
              : null}
          </div>
          {/* Password validation messages */}

          <div className="form-group position-relative">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              className={`form-control ${styles.formControl}`}
              id="exampleInputConfirm_Password"
              placeholder="Confirm Password*"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className={`position-absolute end-0 top-50 translate-middle-y ${styles.eyeIcon}`}
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} // Toggle password visibility on click
            >
              {confirmPasswordVisible ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}{" "}
            </span>
          </div>
          <div className={styles.terms}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={handleCheckboxChange}
            />
            <label className={styles.labelTerm}>
              I agree to the{" "}
              <span className={styles.termsHover} onClick={openModal}>
                Terms and Conditions
              </span>
            </label>
          </div>
          <button
            // disabled={!agreedToTerms}
            className={styles.submit}
            onClick={registerUser}
          >
            CREATE ACCOUNT
          </button>
          <div className={styles.already}>
            <span>Already account?</span> <Link to="/login">Login</Link>
            <p className={`${styles.powerBy}`}>
              Powered by <img src={logo} alt="MacMillan" />
            </p>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Terms
          closeModal={closeModal}
          setAgreedToTerms={setAgreedToTerms}
          agreedToTerms={agreedToTerms}
          passwordStrength={passwordStrength}
        />
      )}
    </div>
  );
};
