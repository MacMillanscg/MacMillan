import React from "react";
import styles from "./Terms.module.css";

export const Terms = ({ closeModal }) => {
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className="my-1">Terms and Conditions</h2>
        </div>
        <div>
          <p className={styles.termsText}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum
          </p>
          <button className="btn" onClick={closeModal}>
            I Agreed
          </button>
        </div>
      </div>
    </div>
  );
};
