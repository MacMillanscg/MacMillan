import React, { useState, useEffect, useRef } from "react";
import styles from "./ColumnManagementModal.module.css";

export const ColumnManagementModal = ({ columns, setColumns, onClose }) => {
  const [localColumns, setLocalColumns] = useState(columns);

  const popupRef = useRef(null);
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

  const handleCheckboxChange = (index) => {
    const updatedColumns = [...localColumns];
    updatedColumns[index].visible = !updatedColumns[index].visible;
    console.log("updatedcolum", updatedColumns);
    setLocalColumns(updatedColumns);
  };

  const handleApply = () => {
    setColumns(localColumns);
    onClose();
  };

  const handleSelectAllChange = (e) => {
    const updatedColumns = localColumns.map((col) => ({
      ...col,
      visible: e.target.checked,
    }));
    setLocalColumns(updatedColumns);
  };

  return (
    <div className={styles.modalOverlay} ref={popupRef}>
      <div className={styles.modalContent}>
        {/* <h4>Manage Columns</h4> */}
        <div className={styles.checkboxGroup}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              checked={localColumns.every((col) => col.visible)}
              onChange={handleSelectAllChange}
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
