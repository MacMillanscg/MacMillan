import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/images/logo.jpg";
import "./Register.css";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setAgreedToTerms(!agreedToTerms);
  };

  const registerUser = async () => {
    // Validation checks
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter a password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Password strength validation
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

    // if (password === confirmPassword) {
    const userObj = {
      name,
      email,
      password,
      confirmPassword,
    };
    try {
      toast.loading("Loading");
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        userObj
      );
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
  return (
    <div className="authenticate">
      <div className="formWrap sign-up">
        <div className="logo">
          <img src={logo} alt="Macmallin logo" />
        </div>
        <h3 className="text-center">MacMillan</h3>

        <div className="inputFields">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="exampleInputFUllName"
              placeholder="Full Name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail"
              placeholder="Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword"
              placeholder="Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="exampleInputConfirm_Password"
              placeholder="Confirm Password*"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="term">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={handleCheckboxChange}
            />
            <label>I agree to the Terms and condition</label>
          </div>
          <button
            disabled={!agreedToTerms}
            className="submit"
            onClick={registerUser}
          >
            CREATE ACCOUNT
          </button>
          <div className="already">
            <span>Already account?</span> <Link to="/login">Login</Link>
            <p className="me-3">
              Powered by <img src={logo} alt="MacMillan" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
