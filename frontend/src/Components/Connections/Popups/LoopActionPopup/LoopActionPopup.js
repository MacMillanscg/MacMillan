import React from "react";
import styles from "./LoopActionPopup.module.css";

export const LoopActionPopup = () => {
  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search Actions"
        className={`${styles.searchInput} form-control mb-4`}
      />
      <div className={styles.loopOptionsWrap}>
        <div className={styles.actionDescription}>
          <h4 className={`m-0 mb-2`}>Break Loop</h4>
          <p className={styles.logicDescription}>
            Breaks out of the current Loop, causing execution to resume after
            the containing Loop.
          </p>
        </div>
        <div className={styles.actionDescription}>
          <h4 className={`m-0 mb-2`}>Loop N Times</h4>
          <p className={styles.logicDescription}>
            Loops over the the steps in the loop N times, or until a loop break
            occurs.{" "}
          </p>
        </div>
        <div className={styles.actionDescription}>
          <h4 className={`m-0 mb-2`}>Loop Over Items</h4>
          <p className={styles.logicDescription}>
            Loops over items, applies each step in sequence, and returns a new
            collection of the results. Items must be an Array or Object.
          </p>
        </div>
      </div>
    </div>
  );
};
