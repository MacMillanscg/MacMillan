import React, { useState, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import axios from "axios";
import { url } from "../../../api";
import { getUser } from "../../../storageUtils/storageUtils";
import styles from "./User.module.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronDown,
  faEllipsisV,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { AddMemberModal } from "./AddMemberModal/AddMemberModal"; // Import AddMemberModal component
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ConfirmCancelPopUp } from "../../Common/ConfirmCancelPopUp/ConfirmCancelPopUp";

export const Users = () => {
  const { dashboardWidth } = useAppContext();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false); // State for Add Member Modal
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const navigate = useNavigate(); // Hook for navigation
  const createdBy = getUser()?._id;

  console.log("memebers", members);

  // Fetch all members on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${url}/explore/members/${createdBy}`);
        if (response.data.success) {
          setMembers(response.data.newMembers);
        }
      } catch (err) {
        setError("Error fetching members");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [fetchTrigger, createdBy]);

  // Filter users when members or createdBy change
  // useEffect(() => {
  //   if (members && createdBy) {
  //     const updatedMembers = members.filter(
  //       (member) =>
  //         member.createdBy?._id === createdBy &&
  //         (member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //           member.email.toLowerCase().includes(searchQuery.toLowerCase()))
  //     );
  //     setFilteredUsers(updatedMembers);
  //   }
  // }, [members, createdBy, searchQuery]);

  const handleCardClick = (id) => {
    console.log("id of new member", id);
    navigate(`/explore/users/${id}`);
  };

  const handleAddMemberClick = () => {
    setShowModal(true); // Show Add Member Modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close Add Member Modal
  };

  const handleDeletModal = (clientId) => {
    setShowDeleteModal(true);
    setClientToDelete(clientId);
  };

  // Delete member function
  const deleteMember = async () => {
    try {
      const response = await axios.delete(
        `${url}/explore/member/${clientToDelete}`
      );
      if (response.data.success) {
        toast.success("Member deleted successfully!");
        setFetchTrigger(!fetchTrigger);
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error("Error deleting member", err);
      toast.error("Failed to delete member.");
    }
  };

  if (loading) return <p>Loading members...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      {/* Header Section */}
      <div className={styles.clientHeader}>
        <h2 className={styles.heading2}>Members</h2>
        <div className={styles.clientsRight}>
          {/* Search Bar */}
          <div className="form-group me-4">
            <input
              type="text"
              className={`form-control ${styles.formControl}`}
              id="searchBar"
              placeholder="Search members"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Button */}
          <div className={styles.selectFilterOption}>
            <button className={styles.filterBtn}>
              Filter
              <FontAwesomeIcon
                icon={faChevronDown}
                className={styles.filterIcon}
              />
            </button>
          </div>

          {/* Add New Member Button */}
          <button
            className={`btn btn-success ${styles.addBtn} ms-4`}
            onClick={handleAddMemberClick}
          >
            <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
            Add New Member
          </button>
        </div>
      </div>

      {/* User Cards Section */}
      <div className={styles.cardContainer}>
        {members.length === 0 ? (
          <p>No users found</p>
        ) : (
          members.map((user) => (
            <div
              className={styles.card}
              key={user._id}
              onClick={() => handleCardClick(user._id)} // Handle click
            >
              <div className={styles.cardTop}>
                <div className={styles.avatar}>
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className={styles.EditDeleteShow}>
                  <FontAwesomeIcon icon={faEllipsisV} className={styles.dots} />
                  <div className={styles.editDelteIconsWrap}>
                    <Link to={`/explore/users/${user._id}`}>
                      <FontAwesomeIcon
                        icon={faPencil}
                        className={styles.editIcon}
                      />
                    </Link>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className={styles.deleteIcon}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent the default card click behavior
                        e.stopPropagation();
                        handleDeletModal(user._id);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p className={styles.role}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        showModal={showModal}
        handleClose={handleCloseModal}
        setFetchTrigger={setFetchTrigger}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmCancelPopUp
          headerText="Warning"
          bodyText="Are you sure you want to delete this record?"
          onOk={deleteMember}
          onCancel={() => setShowDeleteModal(false)}
          okButtonText="Yes"
          cancelButtonText="No"
        />
      )}
    </div>
  );
};
