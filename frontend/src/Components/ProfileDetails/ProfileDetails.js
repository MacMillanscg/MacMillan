import React, { useState, useEffect } from "react";
import styles from "./ProfileDetails.module.css";
import { Link } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { url } from "../../api";
import { useNavigate } from "react-router-dom";
import { ConfirmCancelPopUp } from "../Common/ConfirmCancelPopUp/ConfirmCancelPopUp";
import { getUser } from "../../storageUtils/storageUtils";

export const ProfileDetails = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [originalData, setOriginalData] = useState({ name: "", phone: "" });

  const { dashboardWidth } = useAppContext();
  const user = getUser();

  const userCapitalize =
    userProfile?.name.charAt(0).toUpperCase() + userProfile?.name.slice(1);

  const navigate = useNavigate();
  useEffect(() => {
    if ((user && user.name) || user.phone) {
      setName(user.name);
      setPhone(user.phone);
    }
  }, [user._id]);

  useEffect(() => {
    const fetchSingleProfile = async () => {
      try {
        const response = await axios.get(`${url}/auth/${user._id}`);
        const userData = response.data;
        setUserProfile(userData);
        setName(userData.name);
        setPhone(userData.phone);
        setOriginalData({ name: userData.name, phone: userData.phone });
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleProfile();
  }, []);

  const userImageUrl = `http://localhost:5000/${userProfile?.profileImage}`;

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async () => {
    let errorOccurred = false;
    if (!name.trim()) {
      toast.error("Please enter your name");
      errorOccurred = true;
    }
    if (!phone) {
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
      const response = await axios.post(
        `${url}/auth/profiledetails`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { user } = response.data;
      if (response.data.success) {
        toast.success(response.data.message);
        // setProfileImage(user.profileImage);
        localStorage.setItem("rememberMeUser", JSON.stringify(user));
        sessionStorage.setItem("userRecord", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  // Function to restrict non-alphabetic characters in name input field
  const handleNameKeyPress = (e) => {
    const char = String.fromCharCode(e.which);
    if (!/[a-zA-Z ]/.test(char)) {
      e.preventDefault();
    }
  };

  const onhandleCancel = () => {
    if (isDirty()) {
      setShowDialog(true);
    }
  };

  const isDirty = () => {
    return (
      name !== originalData.name ||
      phone !== originalData.phone ||
      selectedFile !== null
    );
  };

  const handleOk = () => {
    setShowDialog(false);
    setName(originalData.name);
    setPhone(originalData.phone);
    setSelectedFile(null);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <div className="home-section" style={{ width: dashboardWidth }}>
      <div className={styles.profileDetails}>
        <div className={styles.profiletop}>
          <span className="me-2">Profile</span>/
          <span className={`ms-2 ${styles.profilename}`}>{userCapitalize}</span>
          <div className={styles.inner}>
            <div className="inner-left">
              <span
                className={!userProfile?.profileImage ? styles.subtitle : ""}
              >
                {userProfile?.profileImage ? (
                  <img
                    className={styles.profileImage0}
                    src={userImageUrl}
                    alt={`${userProfile?.name}'s profile`}
                  />
                ) : (
                  userProfile?.name.slice(0, 2).toUpperCase()
                )}
              </span>
              <span className={styles.title}>{userCapitalize}</span>
            </div>
            <div className="inner-right">
              <button className={styles.cancel} onClick={onhandleCancel}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`btn btn-success ${styles.save}`}
                disabled={!isDirty()}
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
          {showDialog && (
            <ConfirmCancelPopUp
              headerText="Warning"
              bodyText="You have unsaved data. Do you want to continue?"
              onOk={handleOk}
              onCancel={handleCancel}
              okButtonText="Ok"
              cancelButtonText="Cancel"
            />
          )}
        </div>
        <div className={styles.profilebottom}>
          <div className="form-section d-flex">
            <div className="left">
              <span className={!userProfile?.profileImage ? styles.img : ""}>
                {userProfile?.profileImage ? (
                  <img
                    className={styles.profileImage}
                    src={userImageUrl}
                    alt=""
                  />
                ) : (
                  userProfile?.name.slice(0, 2).toUpperCase()
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
                onKeyPress={handleNameKeyPress}
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
