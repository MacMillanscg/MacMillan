import React from "react";
import styles from "./LogicToolsPopup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodeBranch,
  faSync,
  faBed,
  faChevronRight,
  faBan,
} from "@fortawesome/free-solid-svg-icons";

export const LogicToolsPopup = ({ onOpenActionPopup, openLoopPopup }) => {
  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search components"
        className={`${styles.searchInput} form-control mb-4`}
      />

      <div className={styles.logicOption} onClick={onOpenActionPopup}>
        <div className={styles.optionIcon}>
          <FontAwesomeIcon icon={faCodeBranch} className={styles.faIcon} />{" "}
          Branch
        </div>
        <div className={styles.actions}>
          3 Actions{" "}
          <FontAwesomeIcon icon={faChevronRight} className={styles.rightIcon} />
        </div>
      </div>
      <div className={styles.logicOption} onClick={openLoopPopup}>
        <div className={styles.optionIcon}>
          <FontAwesomeIcon icon={faSync} className={styles.faIcon} /> Loop
        </div>
        <div className={styles.actions}>
          {" "}
          3 Actions
          <FontAwesomeIcon
            icon={faChevronRight}
            className={`${styles.rightIcon} ${styles.showIcon}`}
          />
        </div>
      </div>
      <div className={styles.logicOption}>
        <div className={styles.optionIcon}>
          <FontAwesomeIcon icon={faBed} className={styles.faIcon} /> Sleep
        </div>
        <div className={styles.actions}>
          1 Action
          <FontAwesomeIcon
            icon={faChevronRight}
            className={`${styles.rightIcon} ${styles.showIcon}`}
          />
        </div>
      </div>
      <div className={styles.logicOption}>
        <div className={styles.optionIcon}>
          <FontAwesomeIcon icon={faBan} className={styles.faIcon} /> Stop
          Execution
        </div>
        <div className={styles.actions}>
          1 Action
          <FontAwesomeIcon
            icon={faChevronRight}
            className={`${styles.rightIcon} ${styles.showIcon}`}
          />
        </div>
      </div>
    </div>
  );
};
