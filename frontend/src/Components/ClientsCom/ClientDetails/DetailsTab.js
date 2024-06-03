import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./DetailsTab.module.css";
import { useAppContext } from "../../Context/AppContext";

export const DetailsTab = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const { dashboardWidth } = useAppContext();

  const handleToggle = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  return (
    <div>
      <div className={styles.profileDetails} style={{ maxWidth: "600px" }}>
        <div className={styles.profilebottom}>
          <div className="inputFields">
            <div className="form-group mb-2">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                id="exampleInputName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                // onKeyPress={handleNameKeyPress}
              />
            </div>
            <div className="form-group mb-2">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputFUllName"
                value={email}
              />
            </div>

            <div className="form-group mb-2">
              <label>Phone</label>
              <input
                type="number"
                className="form-control"
                id="exampleInputConfirm_Password"
                placeholder="+1"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              {/* <label>Status</label> */}
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault"
                  checked={isActive}
                  onChange={handleToggle}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckDefault"
                >
                  {isActive ? "Active" : "Inactive"}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
