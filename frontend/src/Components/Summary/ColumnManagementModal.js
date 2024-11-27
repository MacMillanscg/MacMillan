import React, { useState, useEffect, useRef } from "react";
import styles from "./ColumnManagementModal.module.css";

export const ColumnManagementModal = ({ columns, setColumns, onClose }) => {
  const [localColumns, setLocalColumns] = useState(columns); // Temporary state for column visibility
  const popupRef = useRef(null);

  // Handle the click outside of modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  // Handle individual checkbox change
  const handleCheckboxChange = (index) => {
    const updatedColumns = [...localColumns];
    updatedColumns[index].visible = !updatedColumns[index].visible;
    setLocalColumns(updatedColumns);
  };

  // Handle the "All" checkbox for toggling all columns
  const handleSelectAll = () => {
    const allVisible = localColumns.every((col) => col.visible);
    const updatedColumns = localColumns.map((col) => ({
      ...col,
      visible: !allVisible,
    }));
    setLocalColumns(updatedColumns);
  };

  // Apply the changes and update the parent state
  const handleApply = () => {
    setColumns(localColumns); // Apply changes to parent component
    onClose(); // Close the modal
  };

  return (
    <div className={styles.modalOverlay} ref={popupRef}>
      <div className={styles.modalContent}>
        <div className={styles.checkboxGroup}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              checked={localColumns.every((col) => col.visible)}
              onChange={handleSelectAll}
            />
            <label>All</label>
          </div>
          {localColumns.map((col, index) => (
            <div key={index} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={col.visible}
                onChange={() => handleCheckboxChange(index)}
              />
              <label>{col.name}</label>
            </div>
          ))}
        </div>
        <div className={styles.modalActions}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleApply} className="btn btn-primary">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
