import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../../../Context/AppContext";
import axios from "axios";
import styles from "./UserDetails.module.css"; // Import CSS module
import { url } from "../../../../api"; // Your API base URL
import toast from "react-hot-toast";
import { ConfirmCancelPopUp } from "../../../Common/ConfirmCancelPopUp/ConfirmCancelPopUp";

export const UserDetails = () => {
  const { dashboardWidth } = useAppContext();
  const { id } = useParams(); // Get user ID from the URL
  const navigate = useNavigate(); // For navigation
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const userCapitalize =
    user?.name.charAt(0).toUpperCase() + user?.name.slice(1);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${url}/explore/member/${id}`);
        console.log("resposne", response);
        if (response.data.success) {
          setUser(response.data.member);
          setOriginalData(response.data.member);
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError("Error fetching user details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);
  console.log("userss", user);

  // Handle Save
  const handleSave = async () => {
    try {
      const updatedUser = {
        ...user,
        role: user.role.toLowerCase(), // Ensure role is in lowercase
      };

      const response = await axios.put(
        `${url}/explore/member/${id}`,
        updatedUser
      );
      if (response.data.success) {
        toast.success("User details updated successfully");
      }
    } catch (err) {
      console.error("Error updating user details:", err);
      toast.error("Failed to update user details");
    }
  };

  const isDirty = () => {
    return user.name !== originalData.name || user.phone !== originalData.phone;
  };

  const onhandleCancel = () => {
    if (isDirty()) {
      setShowDialog(true);
    }
  };

  const handleOk = () => {
    setUser({ ...originalData });
    setShowDialog(false); // Close the dialog
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  // Loading and error handling
  if (loading) return <p>Loading user details...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="home-section" style={{ width: dashboardWidth }}>
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
      <div className={styles.profiletop}>
        <div className={styles.inner}>
          <div className="inner-left">
            <span className="me-2">
              <Link to={`/explore/users`}>Members</Link>
            </span>
            /
            <span className={`ms-2 ${styles.profilename}`}>
              {user && userCapitalize}
            </span>
          </div>
          <div className="inner-right">
            <button className={styles.cancel} onClick={onhandleCancel}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`btn btn-success ${styles.save}`}
              //   disabled={!isDirty()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <div className={styles.detailsPage}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            <span>{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className={styles.userInfo}>
            <h2>{user.email}</h2>
          </div>
        </div>

        {/* Form Section */}
        <div className={styles.detailsForm}>
          <div>
            <label>Email</label>
            <input
              type="text"
              value={user.email}
              disabled
              className={styles.disabledInput}
            />
          </div>

          <div>
            <label>Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div>
            <label>Role</label>
            <select
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          <div>
            <label>Phone </label>
            <input
              type="number"
              value={user.phone || ""}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
