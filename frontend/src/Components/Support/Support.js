import React from "react";
import logo from "../../assets/images/logo.jpg";
import styles from "./Support.module.css";

export const Support = () => {
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
              type="email"
              className="form-control"
              id="exampleInputEmail"
              //   placeholder="Email*"
              //   value={email}
              //   onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword"
              //   value={password}
              //   onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            Message
            <textarea
              className={`form-control ${styles.textareaField}`}
              name=""
              id=""
              cols="50"
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className={`submit ${styles.btn}`}>
            Submit Request
          </button>
        </div>
        {/* </form> */}
      </div>
    </div>
  );
};
