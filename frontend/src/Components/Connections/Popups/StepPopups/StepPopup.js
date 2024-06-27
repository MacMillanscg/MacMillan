import React from "react";
import styles from "./StepPopup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export const StepPopup = ({
  back,
  heading,
  onClose,
  children,
  isPopupOpen,
}) => {
  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <div>
            {!isPopupOpen && (
              <button className={styles.backBtn}>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className={styles.leftIcon}
                />
                {back}
              </button>
            )}
            <h6 className="d-inline-block">{heading}</h6>
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
