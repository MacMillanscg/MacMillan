import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../../../Context/AppContext";
import styles from "./FilterPopup.module.css";
import { getUser } from "../../../../storageUtils/storageUtils";

export const FilterPopup = ({ closeModal, applyFilters }) => {
  const { dashboardWidth } = useAppContext();
  const [connectionName, setConnectionName] = useState("");
  const [clientName, setClientName] = useState("");

  let userId = getUser();
  userId = userId?._id;

  const popupRef = useRef(null);

  // Handle clicks outside the popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const handleApplyFilters = () => {
    // Pass the filter values to the applyFilters function
    applyFilters({ connectionName, clientName });
    closeModal();
  };

  const handleClearFilters = () => {
    setConnectionName("");
    setClientName("");
    applyFilters({ connectionName: "", clientName: "" }); // Clear filters
    closeModal();
  };

  return (
    <div className={styles.modalBackground} ref={popupRef}>
      <div className={styles.modalContainer}>
        <div className={styles.tabContent}>
          <div className={styles.filterHeader}>
            <h3>Filters</h3>
            <span onClick={closeModal}>x</span>
          </div>
          <div className={styles.tabPanel}>
            <label htmlFor="connectionName">Connection Name:</label>
            <div className="form-group mb-2">
              <input
                type="text"
                className={`form-control ${styles.formControl}`}
                id="connectionName"
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)} // Set the state when typing
              />
            </div>
          </div>
          <div className={styles.tabPanel}>
            <label htmlFor="clientName">Client:</label>
            <div className="form-group mb-2">
              <input
                type="text"
                className={`form-control ${styles.formControl}`}
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)} // Set the state when typing
              />
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.applyBtn} onClick={handleApplyFilters}>
            Apply
          </button>
          <button className={styles.filterButton} onClick={handleClearFilters}>
            Clear Filter
          </button>
        </div>
      </div>
    </div>
  );
};
