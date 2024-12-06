import React, { useState, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./User.module.css";
import { faPlus, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { AddMemberModal } from "./AddMemberModal/AddMemberModal"; // Import the AddMemberModal
import axios from "axios";
import { url } from "../../../api";

export const Users = () => {
  const { dashboardWidth } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("members", members);

  // Fetch all members on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${url}/explore/members`);
        if (response.data.success) {
          setMembers(response.data.members);
        }
      } catch (err) {
        setError("Error fetching members");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Toggle the modal
  const handleAddMemberClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.clientHeader}>
        <h2 className={styles.heading2}>Users</h2>
        <div className={styles.clientsRight}>
          <div className="form-group me-4">
            <input
              type="text"
              className={`form-control ${styles.formControl}`}
              id="searchBar"
              placeholder="Search members"
            />
          </div>
          <div className={styles.selectFilterOption}>
            <button className={styles.filterBtn}>
              Filter
              <FontAwesomeIcon
                icon={faChevronDown}
                className={styles.filterIcon}
              />
            </button>
          </div>
          <button
            className={`btn btn-success ${styles.addBtn} ms-4`}
            onClick={handleAddMemberClick}
          >
            <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
            Add New Member
          </button>
        </div>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal showModal={showModal} handleClose={handleCloseModal} />
    </div>
  );
};
