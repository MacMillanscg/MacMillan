import React, { useState, useEffect, useRef } from "react";
import styles from "./DotsModal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faDownload,
  faChevronRight,
  faChevronLeft,
  faSync,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";

export const DotsModal = ({
  handlePrintClick,
  handleExportClick,
  setIsModalVisible,
}) => {
  const popupRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsModalVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);
  return (
    <div className={styles.menuIconContainer}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <FontAwesomeIcon icon={faSync} className={styles.icons} />
          <FontAwesomeIcon icon={faChevronLeft} className={styles.icons} />
          <FontAwesomeIcon icon={faChevronRight} className={styles.icons} />
          <FontAwesomeIcon icon={faEllipsisV} className={styles.icons} />
        </div>
        <ul>
          <li>
            <button onClick={handlePrintClick}>
              <FontAwesomeIcon icon={faPrint} className={styles.icon} />
              Print
            </button>
          </li>
          <li>
            <button onClick={handleExportClick}>
              <FontAwesomeIcon icon={faDownload} className={styles.icon} />{" "}
              Export
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
