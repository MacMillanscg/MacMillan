import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./Login.css";
import logo from "../../assets/images/logo.jpg";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const loginUser = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter a password");
      return;
    }
    const userObj = {
      email,
      password,
    };
    try {
      toast.loading("Loading");
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        userObj
      );
      toast.dismiss();
      console.log("login response", response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        //  in data we have stored token
        localStorage.setItem("user", response.data.data);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      loginUser();
    }
  };

  return (
    <div className="authenticate">
      <div className="formWrap login">
        <div className="logo">
          <img src={logo} alt="Macmallin logo" />
        </div>
        <h3 className="text-center">MacMillan</h3>
        {/* <form> */}
        <div className="inputFields">
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
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="remember d-flex justify-content-between my-2">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckIndeterminate"
              />
              <label class="form-check-label" for="flexCheckIndeterminate">
                Remember Me
              </label>
            </div>
            <div class="forgot">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </div>

          <button
            onClick={loginUser}
            onKeyPress={handleKeyPress}
            type="submit"
            className="submit"
          >
            Log In
          </button>
          <div className="no-account text-end mt-1">
            <p>
              Don't have account <Link to="/register">Sign Up here</Link>
            </p>
          </div>
          <p className="para me-3">
            Powered by <img src={logo} alt="MacMillan" />
          </p>
        </div>
        {/* </form> */}
      </div>
    </div>
  );
};
