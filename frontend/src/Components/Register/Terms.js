import React, { useState } from "react";
import styles from "./Terms.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const Terms = ({
  closeModal,
  setAgreedToTerms,
  agreedToTerms,
  passwordStrength,
}) => {
  const handleCheckboxChange = (e) => {
    setAgreedToTerms(e.target.checked);
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className="my-1">Terms and Conditions</h2>
          <FontAwesomeIcon
            icon={faTimes}
            className={styles.closeIcon}
            onClick={closeModal} // Close modal on click
          />
        </div>
        <div className={styles.termsContent}>
          <p className={styles.termsText}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </div>
        <div className={`progress mb-2 ${styles.progressBar}`}>
          <div
            className={`progress-bar ${
              passwordStrength >= 4
                ? "bg-success"
                : passwordStrength === 3
                ? "bg-warning"
                : "bg-danger"
            }`}
            role="progressbar"
            style={{ width: `${(passwordStrength / 4) * 100}%` }}
            aria-valuenow={passwordStrength}
            aria-valuemin="0"
            aria-valuemax="4"
          ></div>
        </div>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="agreeCheckbox"
            checked={agreedToTerms}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="agreeCheckbox">
            I have read all the listed terms and conditions above
          </label>
        </div>
        {/* <button
          className={`btn ${styles.agreeButton}`}
          disabled={!isChecked} // Button is disabled until checkbox is checked
          onClick={closeModal}
        >
          I Agreed
        </button> */}
      </div>
    </div>
  );
};
