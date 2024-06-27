import React from "react";
import styles from "./StepPopup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

// Re useable popup when I click on + icon

export const StepPopup = ({
  back,
  heading,
  onClose,
  children,
  isPopupOpen,
  onBack,
}) => {
  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <div>
            {!isPopupOpen && (
              <button className={styles.backBtn} onClick={onBack}>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className={styles.leftIcon}
                />
                {back}
              </button>
            )}
            <h6 className="d-inline-block fw-600">{heading}</h6>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.popupBody}>{children}</div>
      </div>
    </div>
  );
};
