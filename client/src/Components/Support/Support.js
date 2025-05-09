import React, { useState } from "react";
import logo from "../../assets/images/logo.jpg";
import styles from "./Support.module.css";
import axios from "axios";
import toast from "react-hot-toast";
import { url } from "../../api";

export const Support = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errorOccurred = false;
    if (name.length < 1 && email.length < 1 && message.length < 1) {
      toast.error("Please fill the form");
      errorOccurred = true;
    }

    if (!errorOccurred) {
      if (name.length < 1) {
        toast.error("Please enter your name");
        errorOccurred = true;
      }

      if (email.length < 1) {
        toast.error("Please enter your email");
        errorOccurred = true;
      }
      if (message.length < 1) {
        toast.error("Please write something in the box");
        errorOccurred = true;
      }
    }

    if (errorOccurred) {
      return;
    }

    try {
      const response = await axios.post(`${url}/supports/support`, {
        name,
        email,
        message,
      });
      console.log("res", response);
      if (response.status === 200) {
        toast.success(
          "Your request has been submitted and our team will reach out to you soon"
        );
        setName("");
        setEmail("");
        setMessage("");
        console.log("Email sent successfully");
      } else {
        // Handle error, e.g., show an error message
        console.error("Error sending email");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNameKeyPress = (e) => {
    const char = String.fromCharCode(e.which);
    if (!/[a-zA-Z ]/.test(char)) {
      e.preventDefault();
    }
  };

  return (
    <div className="authenticate">
      <div className={styles.support}>
        <div className={styles.logo}>
          <img src={logo} alt="Macmallin logo" />
        </div>
        <h3 className={`text-center ${styles.heading3}`}>Contact Us</h3>
        <p className={`text-center`}>
          Please fill out the form below to get in touch with us
        </p>
        {/* <form> */}
        <div className="inputFields mt-2">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              //   placeholder="Email*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleNameKeyPress}
            />
          </div>
          <div className="form-group mt-1">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-1">
            Message
            <textarea
              className={`form-control ${styles.textareaField}`}
              name=""
              id=""
              cols="50"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className={`btn submit ${styles.btn} mt-2`}
            onClick={handleSubmit}
          >
            Submit Request
          </button>
        </div>
        {/* </form> */}
      </div>
    </div>
  );
};
