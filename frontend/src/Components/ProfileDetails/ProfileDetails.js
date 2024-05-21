import React, { useState, useEffect } from "react";
import styles from "./ProfileDetails.module.css";
import { Link } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useCustomFetch } from "../../customsHooks/useCustomFetch";
import { url } from "../../api";

export const ProfileDetails = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  // const [profileImage, setProfileImage] = useState("");
  // console.log("proile", profileImage);

  const { dashboardWidth } = useAppContext();

  const localStorageUser = JSON.parse(localStorage.getItem("rememberMeUser"));
  const sessionStorageUser = JSON.parse(sessionStorage.getItem("userRecord"));
  const user = localStorageUser || sessionStorageUser;
  const userCapitalize = user.name.charAt(0).toUpperCase() + user.name.slice(1);
  const { data, loading, error } = useCustomFetch(url, user._id);

  useEffect(() => {
    if (user && user.name) {
      setName(user.name);
    }
  }, [user._id]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  console.log("selectedimg", selectedFile);

  const handleSave = async () => {
    let errorOccurred = false;
    if (!name.trim()) {
      toast.error("Please enter your name");
      errorOccurred = true;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      errorOccurred = true;
    }
    if (errorOccurred) {
      return;
    }

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("name", name);
    formData.append("phone", phone);
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    try {
      const response = await axios.post(`${url}/profiledetails`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { user } = response.data;
      console.log("usersssss", user);
      if (response.data.success) {
        toast.success(response.data.message);
        // setProfileImage(user.profileImage);
        localStorage.setItem("rememberMeUser", JSON.stringify(user));
        sessionStorage.setItem("userRecord", JSON.stringify(user));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <div className="home-section" style={{ width: dashboardWidth }}>
      <div className={styles.profileDetails}>
        <div className={styles.profiletop}>
          <span className="me-2">Profile</span>/
          <span className={`ms-2 ${styles.profilename}`}>{userCapitalize}</span>
          <div className={styles.inner}>
            <div className="inner-left">
              <span className={styles.subtitle}>
                {user.profileImage ? (
                  <img
                    className={styles.profileImage0}
                    src={`http://localhost:5000/${user.profileImage.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt=""
                  />
                ) : (
                  user.name.slice(0, 2).toUpperCase()
                )}
              </span>
              <span className={styles.title}>{userCapitalize}</span>
            </div>
            <div className="inner-right">
              <button className={styles.cancel}>Cancel</button>
              <button
                onClick={handleSave}
                className={`btn btn-success ${styles.save}`}
              >
                Save
              </button>
            </div>
          </div>
          <div className="more mb-3">
            <Link to="/profiledetails" className="me-3">
              Details
            </Link>
            <Link to="/profileResetPass">Password</Link>
          </div>
        </div>
        <div className={styles.profilebottom}>
          <div className="form-section d-flex">
            <div className="left">
              <span className={styles.img}>
                {user.profileImage ? (
                  <img
                    className={styles.profileImage}
                    src={`http://localhost:5000/${user.profileImage.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt=""
                  />
                ) : (
                  user.name.slice(0, 2).toUpperCase()
                )}
              </span>
            </div>
            <div className="avato ms-3">
              <label htmlFor="profileImage" className={styles.upload}>
                Upload your photo
              </label>
              <input
                type="file"
                id="profileImage"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <p>
                Your avatar makes it easier for team members to recognize across
                MacMillan
              </p>
            </div>
          </div>
          <div className="inputFields">
            <div className="form-group mb-2">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputFUllName"
                disabled
                value={user.email}
              />
            </div>
            <div className="form-group mb-2">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                id="exampleInputName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <label>Role</label>
              <select
                className="form-select"
                aria-label="Default select example"
              >
                <option selected>Owner</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
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
          </div>
        </div>
      </div>
    </div>
  );
};
