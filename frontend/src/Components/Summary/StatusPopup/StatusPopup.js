import React, { useState, useEffect, useRef } from "react";
import styles from "./StatusPopup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export const StatusPopup = ({
  statuses,
  selectedStatuses,
  setSelectedStatuses,
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState([
    ...selectedStatuses,
  ]);

  const popupRef = useRef(null);

  // Handle clicks outside the popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const handleStatusChange = (status) => {
    const updatedStatuses = [...tempSelectedStatuses];
    if (updatedStatuses.includes(status)) {
      const index = updatedStatuses.indexOf(status);
      updatedStatuses.splice(index, 1);
    } else {
      updatedStatuses.push(status);
    }
    setTempSelectedStatuses(updatedStatuses);
  };

  const handleButtonClick = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleApplyClick = () => {
    setSelectedStatuses(tempSelectedStatuses);
    setIsPopupVisible(false);
  };

  return (
    <div className={styles.statusFilter} ref={popupRef}>
      <div className={styles.statusWrap}>
        Status:
        <button className={styles.statusButton} onClick={handleButtonClick}>
          Status
          <FontAwesomeIcon
            icon={isPopupVisible ? faChevronUp : faChevronDown}
            className="ms-2"
          />
        </button>
      </div>
      {isPopupVisible && (
        <div className={styles.statusPopup}>
          <div className={styles.popupContent}>
            {statuses.map((status) => (
              <div key={status}>
                <input
                  type="checkbox"
                  id={`status-${status}`}
                  value={status}
                  onChange={() => handleStatusChange(status)}
                  checked={tempSelectedStatuses.includes(status)}
                />
                <label htmlFor={`status-${status}`}>{status}</label>
              </div>
            ))}
            <div className={styles.popupButtons}>
              <button
                onClick={() => setIsPopupVisible(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button onClick={handleApplyClick} className={styles.applyButton}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
