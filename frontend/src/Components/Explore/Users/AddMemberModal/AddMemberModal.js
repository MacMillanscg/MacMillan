import React, { useState } from "react";
import styles from "./AddMemberModal.module.css";
import axios from "axios";
import { url } from "../../../../api";
import { getUser } from "../../../../storageUtils/storageUtils";
import toast from "react-hot-toast";

export const AddMemberModal = ({ showModal, handleClose, setFetchTrigger }) => {
  const [memberData, setMemberData] = useState({
    name: "",
    email: "",
    role: "member", // Default role
  });

  let createdBy = getUser();
  createdBy = createdBy?._id;
  console.log("createdBy", createdBy);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { ...memberData, createdBy };

    try {
      // Send data to the backend using Axios
      const response = await axios.post(`${url}/explore/add-member`, data);

      if (response.data.success) {
        toast.success(response.data.message);
        setMemberData({ name: "", email: "", role: "member" }); // Reset the form fields
        setFetchTrigger((prev) => !prev); // Trigger re-fetch of members
        handleClose(); // Close the modal
      } else {
        toast.error("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding member:", error);

      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;

        if (
          errorMessage ===
          "Cannot create a new member with the super admin's name and email."
        ) {
          toast.error(errorMessage);
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  if (!showModal) return null; // Don't render modal if showModal is false

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Add New Member</h3>
          <button onClick={handleClose} className={styles.closeBtn}>
            &times;
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className="form-group mb-2">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={memberData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter name"
            />
          </div>
          <div className="form-group mb-2">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={memberData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter email"
            />
          </div>
          <div className="form-group mb-3">
            <label>Role</label>
            <select
              name="role"
              value={memberData.role}
              onChange={handleChange}
              className="form-control"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="guest">Guest</option>
            </select>
          </div>
          <div className={styles.btnsGroup}>
            <button className={styles.cancelButton} onClick={handleClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${styles.addButton}`}
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
